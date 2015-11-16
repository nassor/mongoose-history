var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');

var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});

var options = {diffOnly: true};
PostSchema.plugin(history,options);

module.exports = mongoose.model('Post_diff', PostSchema);
