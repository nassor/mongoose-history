var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');
  
var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});
PostSchema.plugin(history);

module.exports = mongoose.model('Post', PostSchema);