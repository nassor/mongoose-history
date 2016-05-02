const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  title: String,
  message: String,
  updatedFor: String
});
