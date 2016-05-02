'use strict';
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const mongooseHistory = require('../lib/plugin.js');
const PostSchema = require('./schema/post.js');

describe('Plugin test', () => {
  before(() => {
    mongoose.connect('localhost/test');
    // mongoose.connection.db.dropCollection('post_history');
  });
  after(() => mongoose.connection.close());
  beforeEach(() => delete mongoose.connection.models['post_history']);
  // afterEach(() => mongoose.connection.collections['post_history'].drop())

  it('add an history document when save', (done) => {
    PostSchema.plugin(mongooseHistory);

    const Post = mongoose.model('post', PostSchema, 'post');
    const testPost = new Post({
      title: "Test",
      message: "this is a save test",
      updatedFor: "Nassor"
    });

    testPost.save((err) => {
      expect(err).equal(null);
      checkHistoryPersistence(Post, testPost, (err) => {
        expect(err).equal(null);
        testPost.updatedFor = "Tester";
        testPost.save((err) => {
          checkHistoryPersistence(Post, testPost, (err) => {
            expect(err).equal(null);
            done();
          });
        });
      });
    });
  });

  it('add an history document when remove', (done) => {
    PostSchema.plugin(mongooseHistory);

    const Post = mongoose.model('post', PostSchema, 'post');
    const testPost = new Post({
      title: "Test",
      message: "this is a remove test",
      updatedFor: "Nassor"
    });


    testPost.save((err) => {
      expect(err).equal(null);
      checkHistoryPersistence(Post, testPost, (err) => {
        expect(err).equal(null);
        testPost.remove((err) => {
          checkHistoryPersistence(Post, testPost, (err) => {
            expect(err).equal(null);
            done();
          });
        });
      });
    });
  });
});

function checkHistoryPersistence(model, dataModel, callback) {
  const historyCollection = model.historyCollection();
  const historyData = historyCollection
    .find({
      'd._id': dataModel._doc._id
    })
    .sort({
      'createdAt': -1
    })
    .limit(1).toArray((err, doc) => {
      delete dataModel._doc['__v'];
      expect(dataModel._doc).to.deep.equal(doc[0].d);
      callback(err);
    });
}