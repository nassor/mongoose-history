var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');

var secondConnectionUri = process.env.SECONDARY_CONNECTION_URI || 'mongodb://localhost/mongoose-history-test-second';
var secondConn = mongoose.createConnection(secondConnectionUri);
  
var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});

PostSchema.plugin(history, {historyConnection: secondConn, customCollectionName: 'posts_another_conn_history'});

module.exports = mongoose.model('PostAnotherConn', PostSchema);