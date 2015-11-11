"use strict";
var mongoose = require('mongoose')
  , hm = require('./history-model');

module.exports = function historyPlugin(schema, options) {
  var customCollectionName  = options && options.customCollectionName;
  var diffOnly  = options && options.diffOnly;

  // Clear all history collection from Schema
  schema.statics.historyModel = function() {
    return hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options);
  };

  // Clear all history documents from history collection
  schema.statics.clearHistory = function(callback) {
    var History = hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options);
    History.remove({}, function(err) {
      callback(err);
    });
  };

  // Save original data
  schema.post( 'init', function() {
          this._original = this.toObject();
  } );

  // Create an copy when insert or update, or a diff log
  schema.pre('save', function(next) {
    var original = this._original;
    delete this._original;
    var d = this.toObject();
    var historyDoc = {};

    if(diffOnly && !this.isNew) {
      var diff = {};
      diff['_id'] = d['_id'];
      for(var k in d){
        console.log(d[k]);
        console.log(original[k]);
        if(String(d[k]) != String(original[k])){
          diff[k] = d[k];
          console.log('diff');
        }
      }

      diff.__v = undefined;
      historyDoc['t'] = new Date();
      historyDoc['o'] = 'u';
      historyDoc['d'] = diff;
    } else {
      d.__v = undefined;
      historyDoc['t'] = new Date();
      historyDoc['o'] = this.isNew ? 'i' : 'u';
      historyDoc['d'] = d;
    }

    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
    history.save(next);
  });

  // Create an copy when insert or update
  schema.pre('remove', function(next) {
    var d = this.toObject();
    d.__v = undefined;

    var historyDoc = {};
    historyDoc['t'] = new Date();
    historyDoc['o'] = 'r';
    historyDoc['d'] = d;

    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
    history.save(next);
  });
};
