/*
    UserInfo.js

    This is a simple example in order to get the user information and print it out to the screen.
    Note that you must already have an OAuth token for the user. Please replace it below.
 */

var Evernode = require('../lib/evernode/');

var evernodeInstance = new Evernode({
    sandbox: true,
    oAuthToken: "XXXXXX"
});

evernodeInstance.getUser(function(err, response) {
  if (err) {
    console.error("Error back from API: " + err);
  } else {
    console.log("retrieved:", JSON.stringify(response));
  }
});

