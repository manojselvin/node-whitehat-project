var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var historySchema = new mongoose.Schema({
  cityName: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    trim: true
  },
  createdAt: {
    type: String,
    required: true,
    trim: true
  }
});

var History = mongoose.model('history', historySchema);
module.exports = History;