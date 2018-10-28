var mysql = require('mysql');

var db_config = {
  host: "localhost",
  user: "noc",
  password: "zDu58P34psUkKH9TAL",
  database: "jirashiftdb"
};

var con;

function handleDisconnect() {
  con = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports.getKnowladgeBase = () =>  {
    return new Promise(function(resolve, reject){
        con.query("SELECT * FROM kbinfo", function (err, result, fields) {
            if (err) throw err;
            let date;
            let arr=[];
            let sevenDaysBefore = new Date();
            sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
            for(var time of result){
                date =new Date(time.Created)
                if(sevenDaysBefore.getTime() <= date.getTime()){
                    arr.push(time);
                }
            }
            resolve(arr);
        });
    });
};

module.exports.getImportantUpdates = () => {
   return new Promise(function(resolve, reject){
        con.query("SELECT * FROM importantinfo", function (err, result, fields) {
            if (err) throw err;
            resolve(result);
        });
    });
};

module.exports.getNocUsers = () => {
   return new Promise(function(resolve, reject){
        con.query("SELECT * FROM noc_users", function (err, result, fields) {
            if (err) throw err;
            resolve(result);
        });
    });
};

module.exports.InsertIntoKBInfo = (ticket,subject,description,links) =>{
    return new Promise(function(resolve, reject){
        con.query(`INSERT INTO kbinfo (Created,Ticket,Subject,Description,Links) 
                 VALUES ('${new Date()}','${ticket}','${subject}','${description}','${links}');`, function (err, result, fields) {
            if (err) reject(err);
            resolve("success");
        });
    });   
}

module.exports.InsertIntoImportantInfo = (description) =>{
    return new Promise(function(resolve, reject){
        con.query(`INSERT INTO importantinfo (description, ttl) VALUES ('${description}','1');` , function (err, result, fields) {
            if (err) reject(err);
            resolve("success");
        });
    });   
}

module.exports.DeleteIntoImportantInfo = (description) =>{
    return new Promise(function(resolve, reject){
        con.query(`DELETE FROM importantinfo WHERE description='${description}';` , function (err, result, fields) {
            if (err) reject(err);
            resolve("success");
        });
    });   
}