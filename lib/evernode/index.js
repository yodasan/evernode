var util = require('util');
var EventEmitter = require("events").EventEmitter;
var thrift = require('thrift');

var UserStore = require('../evernote-thrift/gen-nodejs/UserStore');
var NoteStore = require('../evernote-thrift/gen-nodejs/NoteStore');

var CustomConnections = require('./CustomConnections');

var Evernode = function(options) {

    var self = this;

    self.oAuthToken = options.oAuthToken ? options.oAuthToken : "";
    self.server = options.sandbox ? "sandbox.evernote.com" : "www.evernote.com";

    self.user = null;

    //Call super
    EventEmitter.call(this);

    /* Create clients */

    this.createUserClient = function() {
        var userConnection = CustomConnections.createHTTPSConnection(self.server, 443, '/edam/user');
        return thrift.createClient(UserStore, userConnection);
    };

    this.createNoteClient = function(userShardId) {
        var noteConnection = CustomConnections.createHTTPSConnection(self.server, 443, '/edam/note/' + userShardId);
        return thrift.createClient(NoteStore, noteConnection);
    };

    /* User calls */

    this.getUser = function(callback) {
        var userClient = self.createUserClient();
        userClient.getUser(self.oAuthToken, callback);
    };

    /* Notebook calls */

    this.listNotebooks = function(callback) {
        getUserIfNeededThenCallback(function(err, user) {
            if(user && err) {
                if(!err) err = new Error("User not returned");
                callback(err, null);
            } else {
                var noteClient = self.createNoteClient(user.shardId);
                noteClient.listNotebooks(self.oAuthToken, callback);
            }
        });
    };


    this.createNotebook = function(notebookObj, callback) {
        getUserIfNeededThenCallback(function(err, user) {
            if(user && err) {
                if(!err) err = new Error("User not returned");
                callback(err, null);
            } else {
                var noteClient = self.createNoteClient(user.shardId);
                noteClient.createNotebook(self.oAuthToken, notebookObj, callback);
            }
        });
    };

    /* Note calls */

    this.findNotes = function(filter, offset, maxNotes, callback) {
        getUserIfNeededThenCallback(function(err, user) {
            if(user && err) {
                if(!err) err = new Error("User not returned");
                callback(err, null);
            } else {
                var noteClient = self.createNoteClient(user.shardId);
                noteClient.findNotes(self.oAuthToken, filter, offset, maxNotes, callback);
            }
        });
    };

    this.createNote = function(noteObj, callback) {
        getUserIfNeededThenCallback(function(err, user) {
            if(user && err) {
                if(!err) err = new Error("User not returned");
                callback(err, null);
            } else {
                var noteClient = self.createNoteClient(user.shardId);
                noteClient.createNote(self.oAuthToken, noteObj, callback);
            }
        });
    };

    /* Extra helpers */

    function getUserIfNeededThenCallback(callback) {
      if(!self.user)  {
          self.getUser(function(err, resp) {
            if(err) {
                callback(err, null);
            } else {
                self.user = resp;
                callback(null, self.user);
            }
          });
      } else {
          callback(null, self.user);
      }
    }
};

util.inherits(Evernode, EventEmitter);

Evernode.NoteStoreTypes = require('../evernote-thrift/gen-nodejs/NoteStore_types');
Evernode.Types = require('../evernote-thrift/gen-nodejs/Types_types');

module.exports = Evernode;


