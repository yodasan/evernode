/*
    FindNotes.js

    This example retrieves the user info about the user in order to construct a NoteClient.
    findNotes is then called with no filter for the first 10 notes.
    Note that you must already have an OAuth token for the user. Please replace it below.
 */

var Evernode = require('../lib/evernode/');

var evernodeInstance = new Evernode({
    sandbox: true,
    oAuthToken: "XXXXXX"
});

var noteFilter = new Evernode.NoteStoreTypes.NoteFilter();
noteFilter.words = "";

evernodeInstance.findNotes(noteFilter, 0, 10, function(err, response) {
      if (err) {
        console.error("Error back from API: " + err);
      } else {

        var totalNotes = response.totalNotes;
        var startIndex = response.startIndex;

        var notes = response.notes;

        for(var i=0; i < notes.length; i++) {
            var singleNote = notes[i];
            console.log("Note (id=" + singleNote.guid + "): " + JSON.stringify(singleNote));
        }
      }
    }
);

