var should   = require('should')
  , mongoose = require('mongoose')
  , Schema   = mongoose.Schema
  , history  = require('../lib/mongoose-history');
  
require('./config/mongoose');

describe('History plugin', function() {
  
  var PostSchema = new Schema({
      u_for: String
    , title: String
    , message: String
  });
  PostSchema.plugin(history);
  
  var PostSchemaWithIdx = new Schema({
    u_for: String
  , title: String
  , message: String
  });
  var idx = {'u_at': 1, 'doc.u_for': 1};
  PostSchemaWithIdx.plugin(history, {indexes: [idx]});
  
  var Post =  mongoose.model('Post', PostSchema)
    , HistoryPost = Post.historyModel()
    
    , PostIdx = mongoose.model('PostIdx', PostSchemaWithIdx)
    , HistoryPostIdx = PostIdx.historyModel()
    
    , createAndUpdatePostWithHistory = function(post, callback) {
    post.save(function(err) {
      if(err) return callback(err);
      Post.findOne(function(err, post) {
        if(err) return callback(err);
        post.u_for = 'another_user@test.com';
        post.title = "Title changed";
        post.save(function(err) {
          if(err) return callback(err);
          HistoryPost.findOne({'doc.title': 'Title changed'}, function(err, hpost) {
            callback(err, post, hpost);
          });
        });
      });
    });
  };
    
  var post = null;
  
  beforeEach(function(done) {
    post = new Post({
      u_for: 'mail@test.com',
      title:   'Title test',
      message: 'message lorem ipsum test'
    });
    
    done();
  });
  
  afterEach(function(done) {
    Post.remove({}, function(err) {
      should.not.exists(err);
      Post.clearHistory(function(err) {
        should.not.exists(err);
        done();
      });
    });
  });
  
  it('should keep insert in history', function(done) {
    post.save(function(err) {
      should.not.exists(err);
      HistoryPost.findOne({'doc.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        post.should.have.property('u_for', hpost.doc.u_for);
        post.title.should.be.equal(hpost.doc.title);
        post.should.have.property('message', hpost.doc.message);
        done();
      });
    });
  });
  
  it('should keep update in history', function(done) {
    createAndUpdatePostWithHistory(post, function(err, post, hpost) {
      should.not.exists(err);
      post.u_for.should.be.equal(hpost.doc.u_for);
      post.title.should.be.equal(hpost.doc.title);
      post.message.should.be.equal(hpost.doc.message);
      done();
    });
  });
  
  it('should keep remove in history', function(done) {
    createAndUpdatePostWithHistory(post, function(err, post, hpost) {
      should.not.exists(err);
      post.remove(function(err) {
        should.not.exists(err);
        HistoryPost.find({action: 'remove'}).select('doc').exec(function(err, historyWithRemove) {
          should.exist(historyWithRemove);
          done();
        });
      });
    });
  });
  
  it('could have own indexes', function(done) {
    HistoryPostIdx.collection.indexInformation({full:true}, function(err, idxInformation) {
      'u_at_1_doc.u_for_1'.should.eql(idxInformation[1].name);
      done();
    });
  });
});
