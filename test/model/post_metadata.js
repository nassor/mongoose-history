var mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../../lib/mongoose-history');

var PostSchema = new Schema({
    updatedFor: String
  , title: String
  , message: String
});

var options = {
  metadata: [
    {key: 'title', value: 'title'},
    {key: 'titleFunc', value: function(origin, d){return d.title}},
    {key: 'titleAsync', value: function(original, d, cb){cb(null, d.title)}}
  ]
};
PostSchema.plugin(history,options);

module.exports = mongoose.model('Post_meta', PostSchema);
