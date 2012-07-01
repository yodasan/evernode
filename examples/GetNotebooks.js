/*
    GetNotebooks.js

    This example retrieves the user info about the user in order to construct a NoteClient.
    findNotebooks is then called to get a list of notebooks which are printed on the screen.
    Note that you must already have an OAuth token for the user. Please replace it below.
 */

var Evernode = require('../lib/evernode/');

var evernodeInstance = new Evernode({
    sandbox: true,
    oAuthToken: "XXXXXX"
});

evernodeInstance.listNotebooks(function(err, response) {
  if (err) {
    console.error("Error back from API: " + err);
  } else {
    for(var i=0; i < response.length; i++) {
        var singleNotebook = response[i];
        console.log("Notebook (id=" + singleNotebook.guid + "): " + JSON.stringify(singleNotebook));
    }
  }
});


