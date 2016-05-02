'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const History = require('../lib/history.js');
const PostSchema = require('./schema/post');
const Post = mongoose.model('Post', PostSchema);

describe('Copy document', function() {
  let id;
  let date;
  let operation;
  let post;

  beforeEach(function() {
    id = mongoose.Types.ObjectId();
    date = Date.now();
    operation = 'i';
    post = new Post({
      _id: id,
      title: 'Test',
      message: 'test test',
      updatedFor: 'Nassor Paulino da Silva'
    });
  });

  it('copy the model data into a historic document', function(done) {
    const historic = History.copy(date, operation, post);
    expect(historic).to.deep.equal({
      createdAt: date,
      o: 'i',
      d: {
        _id: id,
        title: 'Test',
        message: 'test test',
        updatedFor: 'Nassor Paulino da Silva'
      }
    });
    done();
  });

  it('copy the model data into a historic document ignoring a field', function(done) {
    const ignoring = ['updatedFor'];
    const historic = History.copy(date, operation, post, ignoring);
    expect(historic).to.deep.equal({
      createdAt: date,
      o: 'i',
      d: {
        _id: id,
        title: 'Test',
        message: 'test test'
      }
    });
    done();
  });

});