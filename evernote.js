var CustomConnections = require('./lib/evernode/CustomConnections');
var UserStore 				= require('./lib/evernote-thrift/gen-nodejs/UserStore');
var NoteStore 				= require('./lib/evernote-thrift/gen-nodejs/NoteStore');
var NoteStoreTypes 		= require('./lib/evernote-thrift/gen-nodejs/NoteStore_types');
var Types 						= require('./lib/evernote-thrift/gen-nodejs/Types_types');

var oauth 						= require('oauth');
var thrift						= require('thrift');

exports.NoteStoreTypes = NoteStoreTypes;
exports.Types 	 = Types;
exports.Evernote = Evernote;

/*
	@param consumer_key 		{String} - Evernote's API ConsumerKey
	@param consumer_secret 	{String} - Evernote's API ConsumerSecret
	@param sandbox {Bool} 
*/
function Evernote(consumer_key, consumer_secret, sandbox){
		
	if(!consumer_key || !consumer_secret) throw 'Argument Execption';
	var server = sandbox? 'sandbox.evernote.com' : 'www.evernote.com'; 
	
	this.createNoteStore = function (shardId) {
	    var noteConnection = CustomConnections.createHTTPSConnection(server, 443, '/edam/note/' + shardId);
	    return thrift.createClient(NoteStore, noteConnection);
	}
	
	this.createUserStore = function () {
	    var userConnection = CustomConnections.createHTTPSConnection(server, 443, '/edam/user');
			return thrift.createClient(UserStore, userConnection);
	}
	
	this.getUserInformation = function (authToken, callback){

		this.createUserStore().getUser(authToken, function(err, response) {
			
			if(response) response.authToken = authToken;
			callback(err, response);
		});
	}
	
	this.oAuth = function(callback_url){
	  return new oauth.OAuth(
	    sandbox?"https://sandbox.evernote.com/oauth":"https://www.evernote.com/oauth", 
			sandbox?"https://sandbox.evernote.com/oauth":"https://www.evernote.com/oauth",
	    consumer_key, 
			consumer_secret, 
			"1.0", 
			callback_url, 
			"PLAINTEXT");   
	}
	
	this.oAuthRedirectUrl = function (oauthRequestToken) {
		if(sandbox)
			return "https://sandbox.evernote.com/OAuth.action?oauth_token="+oauthRequestToken;
		else
			return "https://www.evernote.com/OAuth.action?oauth_token="+oauthRequestToken;
	}
	
}

/*
	findNotes - Find/List notes

	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param words 	{String} - search words
	@param option {Object, optional} - fetch option
		- offset
		- count
		- sortOrder
		- ascending
		- inactive
	@param callback { Function(err, syncResult)... }
*/
Evernote.prototype.findNotes = function(userInfo, words, option, callback)
{
	if(arguments.length < 4){
		callback = option;
		option = {};
	}
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'Argument Execption';
	if(typeof callback != 'function') throw 'Argument Execption';
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	var noteFilter = new NoteStoreTypes.NoteFilter();
	
	noteFilter.words = words || '';
	noteFilter.order = Types.NoteSortOrder[(option.sortOrder || 'UPDATED')];
	noteFilter.ascending = option.ascending || false;
	noteFilter.inactive = option.inactive || false;
	
	var offset = option.offset || 0;
	var count = option.count || 50;
	
	noteStore.findNotes(userInfo.authToken, noteFilter, offset, count, function(err, response) {
    callback(err, response)
  });
}

/*
	getNote - Get note with content.
	
	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param guid {String} - Note's GUID
	@param option {Object, optional} - fetch option
		- withContent
		- withResourcesData
		- withResourcesRecognition
		- withResourcesAlternateData
	@param callback { Function(err, edamNote)... }
*/
Evernote.prototype.getNote = function(userInfo, guid, option, callback)
{
	if(arguments.length < 4){
		callback = option;
		option = {};
	}
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'ArgumentExecption';
	if(!guid) throw 'ArgumentExecption';

	if(typeof callback != 'function') throw 'ArgumentExecption';
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	var withContent = option.withContent || true;
	var withResourcesData = option.withResourcesData || false;
	var withResourcesRecognition = option.withResourcesRecognition || false;
	var withResourcesAlternateData = option.withResourcesAlternateData || false;
	
	noteStore.getNote(userInfo.authToken, guid, withContent, withResourcesData, withResourcesRecognition, withResourcesAlternateData, 
		function(err, response) {
    	callback(err, response);
  	});
}

/*
	createNote - Create note.
	
	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param note {Object} - note
	@param callback { Function(err, edamNote)... }
*/
Evernote.prototype.createNote = function(userInfo, note, callback){
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'Argument Execption';
	if(typeof note 		 != 'object') throw 'Argument Execption';
	if(typeof callback != 'function') throw 'Argument Execption';
	
	if(note.attributes){
		
		if(typeof note.attributes != 'object') throw 'Argument Execption';
		note.attributes = new Types.NoteAttributes(note.attributes);
	}
	
	note = new Types.Note(note);
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	
	noteStore.createNote(userInfo.authToken, note, function(err, response) {
    callback(err, response)
  });
}

/*
	updateNote - Update note.
	
	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param note {Object} - note
	@param callback { Function(err, edamNote)... }
*/
Evernote.prototype.updateNote = function(userInfo, note, callback){
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'Argument Execption';
	if(typeof note 		 != 'object') throw 'Argument Execption';
	if(typeof callback != 'function') throw 'Argument Execption';
	
	if(note.attributes){
		
		if(typeof note.attributes != 'object') throw 'Argument Execption';
		note.attributes = new Types.NoteAttributes(note.attributes);
	}
	
	note = new Types.Note(note);
	
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	
	noteStore.updateNote(userInfo.authToken, note, function(err, response) {
    callback(err, response)
  });
}

/*
	createNote - Create note.
	
	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param guid {String} - The GUID of the note to delete.
	@param callback { Function(err, updateSequenceNumber)... }
*/
Evernote.prototype.deleteNote = function(userInfo, guid, callback){
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'Argument Execption';
	if(typeof callback != 'function') throw 'Argument Execption';
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	
	noteStore.deleteNote(userInfo.authToken, guid, function(err, response) {
    callback(err, response)
  });
	
}

/*
	getNote - Get note with content.
	
	@param userInfo {Object} - User's Infomation with authToken & shardId
		- Normally, this object should be EDAMUser
	@param guid {String} - Note's GUID
	@param option {Object, optional} - fetch option
		- noteOnly : If true, this will only return the text extracted from the ENML contents of the note itself. 
			If false, this will also include the extracted text from any text-bearing resources
		- tokenizeForIndexing : If true, this will break the text into cleanly separated and sanitized tokens. 
			If false, this will return the more raw text extraction, with its original punctuation, capitalization, spacing, etc.
	@param callback { Function(err, text)... }
*/
Evernote.prototype.getNoteSearchText = function(userInfo, guid, option, callback)
{
	if(arguments.length < 4){
		callback = option;
		option = {};
	}
	
	if(!userInfo || !userInfo.shardId || !userInfo.authToken) throw 'ArgumentExecption';
	if(!guid) throw 'ArgumentExecption';

	if(typeof callback != 'function') throw 'ArgumentExecption';
	
	var noteStore = this.createNoteStore(userInfo.shardId);
	var noteOnly = option.noteOnly || true;
	var tokenizeForIndexing = option.tokenizeForIndexing || false;

	noteStore.getNoteSearchText(userInfo.authToken, guid, noteOnly, tokenizeForIndexing,
		function(err, response) {
    	callback(err, response);
  	});
}




