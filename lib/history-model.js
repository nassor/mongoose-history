"use strict";

var mongoose = require('mongoose')
  , historyModels = {};

/**
 * Create and cache a history mongoose model 
 * @param {string} collectionName Name of history collection
 * @return {mongoose.Model} History Model
 */
module.exports.HistoryModel = function(collectionName, options) {
  var prefix  = options && options.prefix
    , suffix  = options && options.suffix
    , indexes = options && options.indexes;
  
  if (!(collectionName in historyModels)) {
    var schema = new mongoose.Schema({ 
      t: {type: Date, required: true},
      o: {type: String, required: true},
      d: {type: mongoose.Schema.Types.Mixed, required: true}
    },{ _id: false, versionKey: false });
    
    if(indexes){
      indexes.forEach(function(idx) {
        schema.index(idx);
      });
    }
    
    historyModels[collectionName] = mongoose.model(collectionName, schema, collectionName);
  }
  
  return historyModels[collectionName];
};

/**
 * Set name of history collection
 * @param {string} collectionName Name of original collection
 * @param {string} prefix Add a prefix in an original collection name
 * @param {string} suffix Add a suffix in an original collection name
 * @return {string} Collection name of history
 */
module.exports.historyCollectionName = function(collectionName, prefix, suffix) {
  if(suffix !== undefined) {
    collectionName = prefix + collectionName;
  }
  
  if(suffix !== undefined) {
    collectionName = collectionName + suffix;
  } else {
    collectionName = collectionName + '_history';
  }
  
  return collectionName;
};