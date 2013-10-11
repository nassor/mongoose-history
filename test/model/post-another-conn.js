var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');
  
var secondConn = mongoose.createConnection('mongodb://localhost/mongoose-history-test-second');
  
var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});

PostSchema.plugin(history, {historyConnection: secondConn, customCollectionName: 'posts_another_conn_history'});

module.exports = mongoose.model('PostAnotherConn', PostSchema);