/*
    CreateNewNote.js

    This example creates a new note in the default notebook
 */

var Evernode = require('../lib/evernode/');

var evernodeInstance = new Evernode({
    sandbox: true,
    oAuthToken: "XXXXXX"
});

evernodeInstance.listNotebooks(function(err, notebooks) {
    for(var i=0; i < notebooks.length; i++) {
        var currentNotebook = notebooks[i];
        if(currentNotebook && currentNotebook.defaultNotebook) {

            var newNote = new Evernode.Types.Note();
            newNote.title = "A new note from Evernode";
            newNote.notebookGuid = currentNotebook.guid;

            var noteContent = '<?xml version="1.0" encoding="UTF-8"?>';
            noteContent+= '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>';
            noteContent+= '<span style="font-weight:bold;">Note from Evernode</span>';
            noteContent+= '</en-note>';

            newNote.content = noteContent;

            evernodeInstance.createNote(newNote, function(err, resp) {
                if(!err) {
                    console.log("New Note =" + JSON.stringify(resp));
                } else {
                    console.error("Error: " + err);
                }
            });
            break;
        }
    }
});