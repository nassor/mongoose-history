"use strict";
var mongoose = require('mongoose')
  , hm = require('./history-model');

module.exports = function historyPlugin(schema, options) {
  var prefix  = options && options.prefix
    , suffix  = options && options.suffix;
  
  // Clear all history collection from Schema
  schema.statics.historyModel = function() {
    return hm.HistoryModel(hm.historyCollectionName(this.collection.name, prefix, suffix), options);
  };
  
  // Clear all history documents from history collection
  schema.statics.clearHistory = function(callback) {
    var History = hm.HistoryModel(hm.historyCollectionName(this.collection.name, prefix, suffix), options);
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
    
    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, prefix, suffix), options)(historyDoc);
    history.save(function(err) { 
      if(err) throw err;
      next(); 
    });
  });
  
  // Create an copy when insert or update
  schema.pre('remove', function(next) {
    this.set('__v', undefined);
    
    var historyDoc = {};
    historyDoc['t'] = new Date();
    historyDoc['o'] = 'r';
    historyDoc['d'] = this;
    
    var history = new hm.HistoryModel(hm.historyCollectionName(this.collection.name, prefix, suffix), options)(historyDoc);
    history.save(function(err) { 
      if(err) throw err;
      next(); 
    });
  });
};
