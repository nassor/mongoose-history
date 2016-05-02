'use strict';
const mongoose = require('mongoose');

module.exports = class History {
  constructor(schema, options) {
    this.indexes = options && options.indexes;
    this.indexesOptions = options && options.indexesOptions;
    this.customCollectionName = options && options.customCollectionName;
    this.customConnection = options && options.customConnection;
    this.historyConn = new Map();
  }

  preSave(doc, next) {
    const conn = this.historyConnection(doc.collection.name);
    const op = doc.isNew ? 'i' : 'u';
    conn.collection.insert(History.copy(
      new Date(),
      op,
      doc
    ), next);
  }

  preRemove(doc, next) {
    const conn = this.historyConnection(doc.collection.name);
    conn.collection.insert(History.copy(
      new Date(),
      'r',
      doc
    ), next);
  }

  collectionName(colName) {
    if (this.customCollectionName) {
      return this.customCollectionName;
    } else {
      return colName + '_history';
    }
  }

  historyConnection(colName) {
    const historicCollectionName = this.collectionName(colName);

    if (this.historyConn.has(historicCollectionName)) {
      return this.historyConn.get(historicCollectionName);
    }

    // creating a collection using a definied connection
    let conn = null;
    if (this.customConnection) {
      conn = this.customConnection.model(historicCollectionName, {}, historicCollectionName);
    } else {
      conn = mongoose.model(historicCollectionName, {}, historicCollectionName);
    }

    // Index setting
    if (this.indexes) {
      indexes.forEach(function(idx) {
        schema.index(idx);
      });
      conn.collection.createIndex(this.indexes, this.indexesOptions);
    }

    this.historyConn.set(historicCollectionName, conn);
    return this.historyConn.get(historicCollectionName);
  }

  static copy(date, operation, data, ignore) {
    const jsonData = data._doc;
    delete jsonData['__v'];

    if (ignore) delete jsonData[ignore];

    return {
      createdAt: date,
      o: operation,
      d: jsonData
    };
  }
};
