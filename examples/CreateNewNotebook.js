/*
    CreateNewNote.js

    This example creates a new notebook
 */

var Evernode = require('../lib/evernode/');

var evernodeInstance = new Evernode({
    sandbox: true,
    oAuthToken: "XXXXXX"
});

var notebookObject = new Evernode.Types.Notebook();
notebookObject.name = "New Evernode Notebook";

evernodeInstance.createNotebook(notebookObject, function(err, resp) {
    if(!err) {
        console.log("New Notebook =" + JSON.stringify(resp));
    } else {
        console.error("Error: " + err);
    }
});