"use strict";

var should      = require('should')
  , Post        = require('./model/post')
  , HistoryPost = Post.historyModel();

require('./config/mongoose');

describe('History plugin', function() {

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

  function updatePostWithHistory(post, callback) {
    post.save(function(err) {
      if(err) return callback(err);

      post.title = 'Updated title';

      Post.update({title: 'Title test'}, post, function(err){
        if(err) return callback(err);
        HistoryPost.findOne({'d.title': 'Updated title'}, function(err, hpost) {
          callback(err, post, hpost);
        });
      });
    });
  };

  function updateOnePostWithHistory(post, callback) {
    post.save(function (err) {
      if (err) return callback(err);

      post.title = 'Updated title';

      Post.updateOne({title: 'Title test'}, post, function (err) {
        if (err) return callback(err);
        HistoryPost.findOne({'d.title': 'Updated title'}, function (err, hpost) {
          callback(err, post, hpost);
        });
      });
    });
  };

  function findOneAndUpdatePostWithHistory(post, callback) {
    post.save(function (err) {
      if (err) return callback(err);

      post.title = 'Updated title';

      Post.findOneAndUpdate({title: 'Title test'}, post, function (err) {
        if (err) return callback(err);
        HistoryPost.findOne({'d.title': 'Updated title'}, function (err, hpost) {
          callback(err, post, hpost);
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

  it('should keep insert in history', function(done) {
    post.save(function(err) {
      should.not.exists(err);
      HistoryPost.findOne({'d.title': 'Title test'}, function(err, hpost) {
        should.not.exists(err);
        hpost.o.should.eql('i');
        post.should.have.property('updatedFor', hpost.d.updatedFor);
        post.title.should.be.equal(hpost.d.title);
        post.should.have.property('message', hpost.d.message);
        done();
      });
    });
  });

  it('should keep update in history', function(done) {
    createAndUpdatePostWithHistory(post, function(err, post, hpost) {
      should.not.exists(err);
      hpost.o.should.eql('u');
      post.updatedFor.should.be.equal(hpost.d.updatedFor);
      post.title.should.be.equal(hpost.d.title);
      post.message.should.be.equal(hpost.d.message);
      done();
    });
  });

  it('should keep update on Model in history', function(done) {
    updatePostWithHistory(post, function (err, post, hpost) {
      should.not.exists(err);
      hpost.o.should.eql('u');
      post.updatedFor.should.be.equal(hpost.d.updatedFor);
      post.title.should.be.equal(hpost.d.title);
      post.message.should.be.equal(hpost.d.message);
      done();
    })
  });

  it('should keep update on Model in history using updateOne()', function (done) {
    updateOnePostWithHistory(post, function (err, post, hpost) {
      should.not.exists(err);
      hpost.o.should.eql('u');
      post.updatedFor.should.be.equal(hpost.d.updatedFor);
      post.title.should.be.equal(hpost.d.title);
      post.message.should.be.equal(hpost.d.message);
      done();
    })
  });

  it('should keep update on Model in history using findOneAndUpdate()', function (done) {
    findOneAndUpdatePostWithHistory(post, function (err, post, hpost) {
      should.not.exists(err);
      hpost.o.should.eql('u');
      post.updatedFor.should.be.equal(hpost.d.updatedFor);
      post.title.should.be.equal(hpost.d.title);
      post.message.should.be.equal(hpost.d.message);
      done();
    })
  });

  it('should keep remove in history', function(done) {
    createAndUpdatePostWithHistory(post, function(err, post, hpost) {
      should.not.exists(err);
      post.remove(function(err) {
        should.not.exists(err);
        HistoryPost.find({o: 'r'}).select('d').exec(function(err, historyWithRemove) {
          historyWithRemove.should.not.be.empty;
          done();
        });
      });
    });
  });

  it('should keep remove in history using findOneAndRemove()', function (done) {
    createAndUpdatePostWithHistory(post, function (err, post, hpost) {
      should.not.exists(err);
      Post.findOneAndRemove({title: post.title}, function (err, doc) {
        should.not.exists(err);
        HistoryPost.find({o: 'r'}).select('d').exec(function (err, historyWithRemove) {
          historyWithRemove.should.not.be.empty;
          historyWithRemove.should.be.instanceOf(Array).and.have.lengthOf(1);
          done();
        });
      });
    });
  });

  it('should keep remove in history using findOneAndDelete()', function (done) {
    createAndUpdatePostWithHistory(post, function (err, post, hpost) {
      should.not.exists(err);
      Post.findOneAndDelete({title: post.title}, function (err, doc) {
        should.not.exists(err);
        HistoryPost.find({o: 'r'}).select('d').exec(function (err, historyWithRemove) {
          historyWithRemove.should.not.be.empty;
          historyWithRemove.should.be.instanceOf(Array).and.have.lengthOf(1);
          done();
        });
      });
    });
  });

});