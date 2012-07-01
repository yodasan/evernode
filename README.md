# Evernode

The node.js thrift module is now part of the official [Apache Thrift project](https://github.com/apache/thrift/).
I'd suggest using the 0.9-dev version.

## Currently In Use

This was created by the team who created [Colorstache](http://www.colorstache.com/) (finalist in the 2011 Evernote Developer Competition).

## Thrift Compiler

I have included the thrift files for the Evernote(TM) 1.21 SDK, so if you feel overly ambitious (or a new version is released), you can export
the thrift API code manually using the following commands:

    thrift --gen js:node -r -strict UserStore.thrift
    thrift --gen js:node -r -strict NoteStore.thrift

## Some manual tweaking (Just an FYI)

While I did copy the generated node.js thrift files from the Evernote(TM) 1.19 SDK, I had to make some changes to some of the regular expression
definitions in Limits_types.js that were generated. Some of the regular expressions had single quotes in them and were also wrapped in single quotes.
Changing them to be wrapped in double quotes fixed it.

I also had to add an include in NoteStore_types.js and UserStore_types.js to require './Types_types'.

## Examples

Examples of using the Evernote(TM) API can be found in the [examples](https://github.com/cloudsnap/evernode/tree/master/examples) folder.
