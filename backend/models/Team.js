const mongoose = require('mongoose');
const TeamDetail = require('./TeamDetail');
const User = require('./User');

const TeamSchema = mongoose.Schema({
  detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TeamDetail,
  },
  list: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    default: [],
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('team', TeamSchema);
