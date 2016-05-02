'use strict';
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const History = require('../lib/history.js');
const PostSchema = require('./schema/post.js');

describe('Collection name tests', function() {
  it('should create a history collection', function(done) {
    const history = new History(PostSchema, {});
    const name = history.collectionName('post');
    expect(name).equal('post_history');
    done();
  });

  it('should create a history collection with a custom collection name', function(done) {
    const history = new History(PostSchema, { customCollectionName: 'post_hst' });
    const name = history.collectionName('post');
    expect(name).equal('post_hst');
    done();
  });
});