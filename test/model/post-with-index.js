var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');
  
var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});

PostSchema.plugin(history, {indexes: [{'t': 1, 'd._id': 1}]});

module.exports = mongoose.model('PostWithIdx', PostSchema);