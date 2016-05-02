'use strict';
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const History = require('./history');

module.exports = exports = function mongooseHistory(schema, options) {
    const history = new History(schema, options)

    schema.statics.historyCollection = function() {
        return history.historyConnection(this.collection.name).collection;
    }

    schema.pre('save', function(next) {
        history.preSave(this, next)
    });

    schema.pre('remove', function(next) {
        history.preRemove(this, next)
    });
}
