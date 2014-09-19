"use strict";
var mongoose = require('mongoose')
  , hm = require('./history-model');

module.exports = function historyPlugin(schema, options) {
  var customCollectionName  = options && options.customCollectionName;
  
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
  
  // Create an copy when insert or update
  schema.pre('save', function(next) {
    this.set('__v', undefined);
    
    var historyDoc = {};
    historyDoc['t'] = new Date();
    historyDoc['o'] = this.isNew ? 'i' : 'u';
    historyDoc['d'] = this;
    
    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
    history.save(next);
  });
  
  // Create an copy when insert or update
  schema.pre('remove', function(next) {
    this.set('__v', undefined);
    
    var historyDoc = {};
    historyDoc['t'] = new Date();
    historyDoc['o'] = 'r';
    historyDoc['d'] = this;
    
    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, customCollectionName), options)(historyDoc);
    history.save(next);
  });
};
