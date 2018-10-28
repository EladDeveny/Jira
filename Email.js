var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'clicktale-com.mail.protection.outlook.com',
  port: 25,
  secure: false
});

var mailOptions = {
  from: 'NOC noc@clicktale.com',
  to: 'noc@clicktale.com',
};

module.exports.SendMail = (html,subject) =>{
    mailOptions.subject= subject;
    mailOptions.html = html;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
}

//module.exports.getImportantUpdates
