"use strict";

var secondConnectionUri = process.env.SECONDARY_CONNECTION_URI || 'mongodb://localhost/mongoose-history-test-second';

var should          = require('should')
  , hm              = require('../lib/history-model')
  , Post            = require('./model/post-with-index')
  , PostAnotherConn = require('./model/post-another-conn')
  , PostMetadata    = require('./model/post_metadata')
  , secondConn      = require('mongoose').createConnection(secondConnectionUri);

require('./config/mongoose');

describe('History Model', function() {
  describe('historyCoolectionName', function() {  
    it('should set a collection name', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name', 'defined_by_user_history_collection_name');
      collectionName.should.eql("defined_by_user_history_collection_name");
      done();
    });
    
    it('should suffix collection name with \'_history\' by default', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name');
      collectionName.should.eql("original_collection_name_history");
      done();
    });
  });
  
  it('should require t(timestamp), o(operation) fields and d(document) field', function(done) {
    var HistoryPost = Post.historyModel();
    var history = new HistoryPost();
    history.save(function(err) {
      should.exists(err);
      history.t = new Date();
      history.save(function(err) {
        should.exists(err);
        history.o = 'i';
        history.save(function(err) {
          should.exists(err);
          history.d = {a: 1};
          history.save(function(err) {
            should.not.exists(err);
            done();
          });
        });
      });
    });
  });
  
  it('could have own indexes', function(done) {
    var HistoryPost = Post.historyModel();
    HistoryPost.collection.indexInformation({full:true}, function(err, idxInformation) {
      't_1_d._id_1'.should.eql(idxInformation[1].name);
      done();
    });
  });
  
  it('could have another connection', function(done) {
    var post = new PostAnotherConn({
      updatedFor: 'mail@test.com',
      title:   'Title test',
      message: 'message lorem ipsum test'
    });
    
    post.save(function(err) {
      should.not.exists(err);
      secondConn.db.collection('posts_another_conn_history', function(err, hposts) {
        should.not.exists(err);
        hposts.findOne(function(err, hpost) {
          post.should.have.property('updatedFor', hpost.d.updatedFor);
          post.title.should.be.equal(hpost.d.title);
          post.should.have.property('message', hpost.d.message);
          done();
        });
      });
    });
  });

  it ('could have additionnal metadata fields', function(){
    var HistoryPost = PostMetadata.historyModel();
    HistoryPost.schema.paths.should.have.property('title')
  })

  
});