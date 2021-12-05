const mongoose = require('mongoose');
const User = require('./User');

const RoomSchema = mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('room', RoomSchema);
