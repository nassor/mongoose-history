"use strict";

var should      = require('should'),
    Post        = require('./model/post_custom_diff'),
    HistoryPost = Post.historyModel();

require('./config/mongoose');

describe('History plugin custom diff algo', function() {

  var post = null;

  function createAndUpdatePostWithHistory(post, newTags, callback) {
    post.save(function(err) {
      if(err) return callback(err);
      Post.findOne(function(err, post) {
        if(err) return callback(err);
        post.updatedFor = 'another_user@test.com';
        post.title = "Title changed";
        post.tags = newTags;
        post.save(function(err) {          
          if(err) return callback(err);
          HistoryPost.findOne({'d.title': 'Title changed'}, function(err, hpost) {
            should.exists(hpost);            
            callback(err, post, hpost);
          });
        });
      });
    });
  };

  var post = null;
  var defaultTags = ['Brazil', 'France'];

  beforeEach(function(done) {
    post = new Post({
      updatedFor: 'mail@test.com',
      title:   'Title test',
      message: 'message lorem ipsum test',
      tags: defaultTags
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
      HistoryPost.findOne({'d.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        should.exists(hpost);        
        hpost.o.should.eql('i');
        post.should.have.property('updatedFor', hpost.d.updatedFor);
        post.title.should.be.equal(hpost.d.title);
        post.should.have.property('message', hpost.d.message);
        done();
      });
    });
  });

  it('should not care about order of tags', function(done) {
    should.exists(post);    
    var newTags = ['France', 'Brazil'];
    createAndUpdatePostWithHistory(post, newTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(hpost);
      hpost.o.should.eql('u');
      should.not.exists(hpost.d.message);
      should.not.exists(hpost.d._v);
      should.not.exists(hpost.d.tags);
      done();
    });
  });

  it('should detect null tags', function(done) {
    should.exists(post);    
    var newTags = null;
    createAndUpdatePostWithHistory(post, newTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(hpost);
      hpost.o.should.eql('u');
      should.not.exists(hpost.d.message);
      should.not.exists(hpost.d._v);
      should(hpost.d.tags).be.null();
      //console.log('%j', hpost);
      done();
    });
  });

  it('should detect new tags', function(done) {
    should.exists(post);    
    var newTags = ['Brazil', 'France', 'Australia'];
    createAndUpdatePostWithHistory(post, newTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(hpost);
      hpost.o.should.eql('u');
      should.not.exists(hpost.d.message);
      should.not.exists(hpost.d._v);
      should.exists(hpost.d.tags);
      hpost.d.tags.should.be.instanceof(Array).and.have.lengthOf(3);
      hpost.d.tags.should.containEql('Brazil');      
      hpost.d.tags.should.containEql('France');      
      hpost.d.tags.should.containEql('Australia');            
      done();
    });
  });

  it('should detect removed tags', function(done) {
    should.exists(post);    
    var newTags = ['Brazil'];
    createAndUpdatePostWithHistory(post, newTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(hpost);
      hpost.o.should.eql('u');
      should.not.exists(hpost.d.message);
      should.not.exists(hpost.d._v);
      should.exists(hpost.d.tags);
      hpost.d.tags.should.be.instanceof(Array).and.have.lengthOf(1);
      hpost.d.tags.should.containEql('Brazil');                 
      done();
    });
  });

  it('should keep just what changed in update', function(done) {
    should.exists(post);    
    createAndUpdatePostWithHistory(post, defaultTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(hpost);
      hpost.o.should.eql('u');
      should.not.exists(hpost.d.message);
      should.not.exists(hpost.d.tags);      
      should.not.exists(hpost.d._v);
      done();
    });
  });

  it('should keep remove in history', function(done) {
    should.exists(post);
    createAndUpdatePostWithHistory(post, defaultTags, function(err, post, hpost) {
      should.not.exists(err);
      should.exists(post);
      post.remove(function(err) {
        should.not.exists(err);
        HistoryPost.find({o: 'r'}).select('d').exec(function(err, historyWithRemove) {
          historyWithRemove.should.not.be.empty;
          done();
        });
      });
    });
  });
});
