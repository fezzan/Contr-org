const mongoose = require('mongoose');
const User = require('./User');
const Room = require('./Room');

const ChatSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  message: {
    type: String,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Room,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('chat', ChatSchema);
