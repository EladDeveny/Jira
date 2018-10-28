const fs = require('fs');
const http = require('http');
const express = require('express');
const url = require('url');
const jiraRequest = require('./JiraRequests.js');
const jiraToHtml = require('./JiraToHtml.js');
const mySql = require('./MySql.js');
const email = require('./Email.js');
const dateModifier = require('./Dates.js');
const activeDirectory = require('./activeDirectory');

var app = express();
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('view engine' , 'hbs');

app.use(express.static(__dirname + '/views'));

app.post('/sendShiftReport', function(req, res) {
    let shiftDate = dateModifier.getDate(req.body.shiftTime);
    let nowDate = new Date();
    let solvedArr = [];
    let events =[];
    let actvieInProgress = [];
    let emailTemplate
    fs.readFile(__dirname + '\\views\\EmailTemplate.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }  
        emailTemplate = data;
        });
    let diff = Math.round((nowDate -shiftDate) / 3600000);
    if(diff < 0){
        diff = 9;
    }
    jiraRequest.sendAjax('project=NOC%20AND%20type="NOC%20Alert"%20AND%20status=Resolved%20AND%20resolutiondate>-'+diff+'h').then(data => {//Resolved
             for(var issue of data["issues"]) {
                solvedArr.push(issue);
             }
             emailTemplate = emailTemplate.replace('{Resolved}',jiraToHtml.GetResolveds(solvedArr));
             jiraRequest.sendAjax('project=NOC%20AND%20type="NOC%20Alert"%20AND%20status!=Resolved%20AND%20status!=Closed').then(data => {// Open In Progress
                 for(var issue of data["issues"]) {
                      actvieInProgress.push(issue);
                 }
                 emailTemplate = emailTemplate.replace('{OpenOrInProgress}',jiraToHtml.GetInProgress(actvieInProgress,shiftDate));
                 jiraRequest.sendAjax('project=NOC%20AND%20type="NOC%20Event"%20AND%20status=Resolved%20AND%20resolutiondate>-36h').then(data => {// NOCEvents
                    for(var issue of data["issues"]) {
                        events.push(issue);
                    } 
                    jiraRequest.sendAjax('project=NOC%20AND%20type="NOC%20Event"%20AND%20status!=Resolved').then(data => {
                        for(var issue of data["issues"]) {
                            events.push(issue);
                        }
                        emailTemplate = emailTemplate.replace('{Events}',jiraToHtml.GetEvents(events));
                        mySql.getKnowladgeBase().then(data =>{
                            emailTemplate = emailTemplate.replace('{KbUpdates}',jiraToHtml.GetKBs(data));
                            mySql.getImportantUpdates().then(data =>{
                                emailTemplate = emailTemplate.replace('{ImportantInfo}',jiraToHtml.GetImportantUpdates(data)); 
                                emailTemplate = emailTemplate.replace('{Shift}',req.body.shiftTime);   
                                emailTemplate = emailTemplate.replace('{NOC}',req.body.name);  
                                emailTemplate = emailTemplate.replace('{NOC Engineer}',req.body.name);   
                                emailTemplate = emailTemplate.replace('{Date}',`${nowDate.getDate()}/${nowDate.getMonth()+1}/${nowDate.getFullYear()}`);           emailTemplate = emailTemplate.replace('{Signature}','http://up419.siz.co.il/up3/jyzmiy3cl3fd.png');                     
                                email.SendMail(emailTemplate,`Shift Handover ${dateModifier.dateTo(shiftDate)} ${req.body.shiftTime}`);
                                res.render('index.hbs');
                            });//Important Updates
                        });//KB
                  })
                 .catch(error => {console.log(error);res.render('index.hbs');})      
                })
                 .catch(error => {console.log(error);res.render('index.hbs');})     
             })
                 .catch(error => {console.log(error);res.render('index.hbs');})    
            })
                 .catch(error => {console.log(error);res.render('index.hbs');})   
    //console.log(req.body.password+req.body.engineer  );
    console.log("post received");
});

app.get('/', (req,res) => {
    if (req.url != '/favicon.ico') {
            activeDirectory.findGroup();
            res.render('index.hbs',{
                test: 'NOC Dashboard'
            });
    }
});

app.post('/addImportantUpdate', (req,res) => {
    console.log('add' + req.body.description);
    mySql.InsertIntoImportantInfo(req.body.description).then(data =>{
        res.redirect('/ShiftReport');
    }).catch(error => {console.log(error);res.render('contactForm.hbs');});
});

app.post('/addKB', (req,res) => {
    console.log('add' + req.body.description);
    mySql.InsertIntoKBInfo(req.body.ticket,req.body.subject,req.body.description,req.body.link).then(data =>{
        res.redirect('/ShiftReport');
    }).catch(error => {console.log(error);res.render('contactForm.hbs');});
});

app.post('/deleteImportantUpdate', (req,res) => {
    console.log('delete' + req.body.important);
    mySql.DeleteIntoImportantInfo(req.body.important).then(data =>{
        res.redirect('/ShiftReport');
    }).catch(error => {console.log(error);res.render('contactForm.hbs');});
});

app.get('/ShiftReport', (req,res) => {
            mySql.getImportantUpdates().then(data =>{
                let importantUpdate ='';
                for(var item of data) {
                    importantUpdate +=`<div class="wrap-input100 validate-input" data-validate = "Message is required">
                    <form method="post"> <input type="hidden" name="important" value='${item.description}'>
                    <button  class='close' width:30%  type='submit' formaction='/deleteImportantUpdate'> \u00D7</button>
                    <p class="lead"> ${item.description}</p> </form></div>`
                }
                mySql.getNocUsers().then(data =>{ 
                    let nocUsers ='';
                    for(var item of data) {
                        nocUsers += `<option> ${item.name} ${item.surename} </option>`;
                    }
                    res.render('contactForm.hbs',{
                            nocUsers : nocUsers,
                            importantUpdate : importantUpdate
                    });       
                }).catch(error => {console.log(error);res.render('contactForm.hbs');});
            }).catch(error => {console.log(error);res.render('contactForm.hbs');});;
});

app.listen(8081);
