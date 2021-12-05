const mongoose = require('mongoose');
const TeamDetail = require('./TeamDetail');
const User = require('./User');

const ProjectSchema = mongoose.Schema({
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TeamDetail,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['To do', 'In Progress', 'Completed'],
    default: 'To do',
  },
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('project', ProjectSchema);
