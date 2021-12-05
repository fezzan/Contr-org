const mongoose = require('mongoose');
const Department = require('./Department');

const TeamDetailsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('teamDetail', TeamDetailsSchema);
