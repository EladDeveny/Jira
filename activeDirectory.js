var ActiveDirectory = require('activedirectory');
var config = { url: 'ldap://rg-main.clicktale.dom',
              baseDN: 'ou=Clicktale,dc=ClickTale,dc=Dom',
              username: 'elad.deveny@clicktale.com',
              password: 'Ed321678#' }
var ad = new ActiveDirectory(config);

var groupName = '*NOC*';

module.exports.findGroup = () => {
ad.findGroup(groupName, function(err, group) {
  if (err) {
    console.log('ERROR: ' +JSON.stringify(err));
    return;
  }
 
  //if (! user) console.log('Group: ' + groupName + ' not found.');
  else {
    console.log(group);
      try{
    console.log('Members: ' + group);
      }
      catch(e){
     console.log('error');
  }
  }
});
}


var query = 'cn=*Lidor*';

module.exports.findUsers = () => {ad.findUsers(query, true, function(err, users) {
  if (err) {
    console.log('ERROR: ' +JSON.stringify(err));
    return;
  }
 
  if ((! users) || (users.length == 0)) console.log('No users found.');
  else {
    console.log('findUsers: '+JSON.stringify(users));
  }
});
                                 }