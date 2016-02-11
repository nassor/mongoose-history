# Mongoose History Plugin

[![Build Status](https://travis-ci.org/nassor/mongoose-history.svg?branch=master)](https://travis-ci.org/nassor/mongoose-history)

Keeps a history of all changes of a document. 

## Installation

```bash
npm install mongoose-history
```

Or add it to your package.json

## Usage

For starting history of your collection, you need to simply add the mongoose-history plugin:

```javascript
var mongoose        = require('mongoose')
  , mongooseHistory = require('mongoose-history')
  , Schema          = mongoose.Schema

var Post = new Schema({
    title:       String
  , message:     String
  , updated_for: String
})

Post.plugin(mongooseHistory)
```
This will generate a log from al your changes on this schema.

You can also use the diffOnly option, that allows you to save just what changed from your previous document to your current. The default configuration is to save the whole documment in your history.

```javascript
var options = {diffOnly: true}
Post.plugin(mongooseHistory, options)
```

The default diff algorithm will convert the old value and the new value to a String, and will compare those strings. You can use the customDiffAlgo option to override the diff algorithm. You can do that, for example, in order to ignore the order of elements inside arrays. Here is an even simpler example, that will ignore the updates made to a specific document key (called 'tags'):

```javascript
var options = {
  diffOnly: true, 
  customDiffAlgo: function(key, newValue, oldValue) {
    if(key !== 'tags' && String(newValue) != String(oldValue)){
      return {
        diff: newValue
      };
    }
    // no diff should be recorded for the tags key
    return null;
  }
};
Post.plugin(mongooseHistory, options)
```


The plugin will create a new collection with format: originalCollectionName +  **_history**, in example: __posts_history__. You can also change the name of the collection by setting the configuration customCollectionName:

```javascript
var options = {customCollectionName: "post_hst"}
Post.plugin(mongooseHistory, options)
```

The history documents have the format:

```javascript
{
    _id:  ObjectId,
    t: Date // when history was made
    o: "i" (insert) | "u" (update) | "r" (remove) // what happens with document
    d: {  // changed document data
        _id:         ObjectId
      , title:       String
      , message:     String
      , updated_for: String
    }
}
```

### Indexes
To improve queries perfomance in history collection you can define indexes, for example:

```javascript
var options = {indexes: [{'t': -1, 'd._id': 1}]};
Post.plugin(mongooseHistory, options)
```

### Send history to another database
You can keep your history collection far away from your primary database or replica set. This can be useful for improve the architecture of your system.

Just create another connection to the new database and link the reference in __historyConnection__:

```javascript
var secondConn = mongoose.createConnection('mongodb://localhost/another_conn');
var options = {historyConnection: secondConn}
Post.plugin(mongooseHistory, options)
```


### Statics
All modules with history plugin have following methods:

#### Model.historyModel()
Get History Model of Model;

#### Model.clearHistory()
Clear all History collection;


## TODO
* **Store additional metadata**
* Rollback methods;
* Recreate all the collection from the historic;

## LICENSE

Copyright (c) 2013, Nassor Paulino da Silva <nassor@gmail.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
