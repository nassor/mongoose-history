"use strict";

var should   = require('should')
  , hm   = require('../lib/history-model')
  , Post   = require('./model/post-with-index');;

require('./config/mongoose');

describe('History Model', function() {
  describe('historyCoolectionName', function() {  
    it('should prefix collection name', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name', 'keep_', '');
      collectionName.should.eql("keep_original_collection_name");
      done();
    });
    
    it('should suffix collection name', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name', '', '_hst');
      collectionName.should.eql("original_collection_name_hst");
      done();
    });
    
    it('should prefix and suffix collection name', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name', 'keep_', '_hst');
      collectionName.should.eql("keep_original_collection_name_hst");
      done();
    });
    
    it('should suffix collection name with \'_history\' by default', function(done) {
      var collectionName = hm.historyCollectionName('original_collection_name');
      collectionName.should.eql("original_collection_name_history");
      done();
    });
  });
  
  it('should require t(timestamp), o(operation) fields; but not d(document) field', function(done) {
    var HistoryPost = Post.historyModel();
    var history = new HistoryPost();
    history.save(function(err) {
      should.exists(err);
      history.t = new Date();
      history.save(function(err) {
        should.exists(err);
        history.o = 'i';
        history.save(function(err) {
          should.not.exists(err);
          
          // Mixed types can't be required 
          history.d = null;
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
  
});