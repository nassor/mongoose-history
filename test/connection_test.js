'use strict';
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const History = require('../lib/history.js');
const PostSchema = require('./schema/post.js');

describe('Historic connection', function() {
  before(() => mongoose.connect('localhost/test'));
  after(() => mongoose.connection.close());

  beforeEach(() => delete mongoose.connection.models['post_history']);

  it('should create a history connection', (done) => {
    const history = new History(PostSchema, {});
    history.historyConnection('post');

    expect(history.historyConn.get('post_history').db.name).equal('test');
    expect(history.historyConn.get('post_history').collection.collectionName).equal('post_history');
    done();
  });

  it('should create a history from a different connection', (done) => {
    const conn = mongoose.createConnection('mongodb://localhost/history_test');
    const options = { 'customConnection': conn };
    const history = new History(PostSchema, options);

    history.historyConnection('post');
    expect(history.historyConn.get('post_history').db.name).equal('history_test');
    expect(history.historyConn.get('post_history').collection.collectionName).equal('post_history');
    done();
  });
});
