const mongoose = require('mongoose');
const Department = require('./Department');
const Team = require('./TeamDetail');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'admin',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department,
    default: null,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Team,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
