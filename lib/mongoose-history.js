var mongoose = require('mongoose');

module.exports = function historyPlugin(schema, options) {
  var historyModels = {}
    , prefix  = options && options.prefix
    , suffix  = options && options.suffix
    , indexes = options && options.indexes;
  
  // Clear all history collection from Schema
  schema.statics.historyModel = function() {
    return HistoryModel(historyCollectionName(prefix, this.collection.name, suffix));
  };
  
  // Clear all history documents from history collection
  schema.statics.clearHistory = function(callback) {
    var History = HistoryModel(historyCollectionName(prefix, this.collection.name, suffix));
    History.remove({}, function(err) {
      callback(err);
    });
  };
  
  // Create an copy when insert or update
  schema.pre('save', function(next) {
    this.set('__v', undefined);
    
    var historyDoc = {};
    historyDoc['u_at'] = new Date();
    historyDoc['action'] = 'save';
    historyDoc['doc'] = this;
    
    var history = new HistoryModel(historyCollectionName(prefix, this.collection.name, suffix))(historyDoc);
    history.save(function(err) { 
      if(err) throw err;
      next(); 
    });
  });
  
  // Create an copy when insert or update
  schema.pre('remove', function(next) {
    this.set('__v', undefined);
    
    var historyDoc = {};
    historyDoc['u_at'] = new Date();
    historyDoc['action'] = 'remove';
    historyDoc['doc'] = this;
    
    var history = new HistoryModel(historyCollectionName(this.collection.name, prefix, suffix))(historyDoc);
    history.save(function(err) { 
      if(err) throw err;
      next(); 
    });
  });
  
  /**
   * Set name of history collection
   * @param {string} collectionName Name of original collection
   * @param {string} prefix Add a prefix in an original collection name
   * @param {string} suffix Add a suffix in an original collection name
   * @return {string} Collection name of history
   */
  function historyCollectionName(collectionName, prefix, suffix) {
    if(prefix) {
      collectionName = prefix + collectionName;
    }
    
    if(suffix) {
      collectionName = collectionName + suffix;
    } else {
      collectionName = collectionName + '_history';
    }
    
    return collectionName;
  }
  
  /**
   * Create and cache a history mongoose model 
   * @param {string} collectionName Name of history collection
   * @return {mongoose.Model} History Model
   */
  function HistoryModel(collectionName) {
    if (!(collectionName in historyModels)) {
      var schema = new mongoose.Schema({ 
        u_at: Date,
        action: String,
        doc: mongoose.Schema.Types.Mixed
      },{ _id: false, versionKey: false });
      
      indexes.forEach(function(idx) {
        schema.index(idx);
      });
      
      historyModels[collectionName] = mongoose.model(collectionName, schema, collectionName);
    }
    
    return historyModels[collectionName];
  }
};
