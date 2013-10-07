# Mongoose History Plugin

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

// Default options
var options = {indexes: null, prefix: null, suffix: '_history'}

Post.plugin(mongooseHistory, options)
```

The plugin will create a new collection with format: __*prefix*|originalCollectionName|*suffix*__,
in example: __posts_history__

The history documents have the format:

```javascript
{
    _id:  ObjectId,
    u_at: Date // when history was made
    action: "save" | "remove" // what happens with document
    doc: {  // changed document data
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
var options = {indexes: {'doc._id': 1}}
Post.plugin(mongooseHistory, options)
```

### Statics
All modules with history plugin have following methods:

#### Model.historyModel()
Get History Model of Model;

#### Model.clearHistory()
Clear all History collection;


## TODO

* Capped history collections;
* Rollback methods;
* Recreate all the collection from the historic;
* Another connection for history collections;

## LICENSE

Copyright (c) 2013, Nassor Paulino da Silva <nassor@gmail.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.