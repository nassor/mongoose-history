var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , history = require('../../lib/mongoose-history');

var PostSchema = new Schema({
    user: String
  , title: String
  , message: String
  , c_at: Date
  , u_at: Date
});

// Defaults from model
PostSchema.path('c_at').default(new Date());
PostSchema.path('u_at').default(new Date());

PostSchema.plugin(history);

module.exports = mongoose.model('Post', PostSchema);