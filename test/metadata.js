"use strict";

var should      = require('should')
  , Post        = require('./model/post_metadata')
  , HistoryPost = Post.historyModel();

require('./config/mongoose');

describe('History plugin with Metadata', function() {

  var post = null;

  function createAndUpdatePostWithHistory(post, callback) {
    post.save(function(err) {
      if(err) return callback(err);
      Post.findOne(function(err, post) {
        if(err) return callback(err);
        post.updatedFor = 'another_user@test.com';
        post.title = "Title changed";
        post.save(function(err) {
          if(err) return callback(err);
          HistoryPost.findOne({'d.title': 'Title changed'}, function(err, hpost) {
            callback(err, post, hpost);
          });
        });
      });
    });
  };

  var post = null;

  beforeEach(function(done) {
    post = new Post({
      updatedFor: 'mail@test.com',
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

  it('should set simple field', function(done) {
    post.save(function(err) {
      should.not.exists(err);
      HistoryPost.findOne({'d.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        hpost.title.should.eql('Title test');
        done();
      });
    });
  });

  it('should set function field', function(done) {
    post.save(function(err) {
      should.not.exists(err);
      HistoryPost.findOne({'d.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        hpost.titleFunc.should.eql('Title test');
        done();
      });
    });
  });

  it('should set async field', function(done) {
    post.save(function(err) {
      should.not.exists(err);
      HistoryPost.findOne({'d.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        hpost.titleAsync.should.eql('Title test');
        done();
      });
    });
  });

});
