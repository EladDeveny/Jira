const https = require('https');

module.exports.sendAjax =  query =>{
    let options = {
        host: 'jira.clicktale.com',
        path: '/rest/api/2/search?jql=' + query,
        requestCert: false,
        port: 443,
        rejectUnauthorized: false,
        headers: {
            'Authorization': 'Basic ' + new Buffer('noc_service' + ':' + 'Aa123456').toString('base64')
        }   
   };
    let data;
    return new Promise(function(resolve, reject){
    https.get(options, (resp) => {
	      // A chunk of data has been recieved.
	    resp.on('data', (chunk) => {
	      data += chunk;
	     });
    // The whole response has been received. Print out the result.
	   resp.on('end', () => {
           try{
               data = data.substring(9);
	           data =  JSON.parse(data);
           }
           catch(err){
               console.log(err)
           }
           console.log("ok");
           resolve(data);
        });	
    }).on("error", (err) => {
	          console.log("Error: " + err.message);
              reject(err);
    });
    });   
}
