const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Team = require('../models/Team');
const TeamDetail = require('../models/TeamDetail');
const User = require('../models/User');

// @route   GET api/teams
// @desc    Get all teams
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const team = await Team.find().populate({
      path: 'detail',
      populate: { path: 'department', model: 'department' },
    });
    //   .populate('list')
    //   .populate('lead');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teams
// @desc    Get all teams detail
// @access  Private
router.get('/detail', auth, async (req, res) => {
  try {
    const team = await TeamDetail.find().populate('department');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teams
// @desc    Get a department all teams
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
  try {
    const team = await Team.find({
      'detail.department': req.params.department,
    })
      .populate({
        path: 'detail',
        populate: { path: 'department', model: 'department' },
      })
      .populate('list')
      .populate('lead');
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/teams
// @desc    Add new team
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, department, lead, list } = req.body;
  try {
    const newTeamDetail = new TeamDetail({
      name,
      description,
      department,
    });
    let teamDetail = await newTeamDetail.save();

    // teamDetail = await TeamDetail.populate(teamDetail,{
    //     path:'department'
    // });

    const newTeam = new Team({ detail: teamDetail.toObject()._id, list, lead });

    let team = await newTeam.save();

    list.push(lead);
    for (const item of list) {
      await User.findByIdAndUpdate(
        item,
        { $set: { team: teamDetail.toObject()._id } },
        { new: true }
      );
    }

    team = await Team.populate(team, {
      path: 'detail',
      model: 'teamDetail',
      populate: {
        path: 'department',
        model: 'department',
      },
    });
    // team = await Team.populate(team, {
    //   path: 'lead',
    //   select: '-password',
    // });
    // team = await Team.populate(team, {
    //   path: 'list',
    //   select: '-password',
    // });

    res.json({ data: team, message: 'Team added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/teams/:id
// @desc    Update team
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, department, lead, list } = req.body;
  // Build team object
  const teamFields = {};
  const teamDetailFields = {};

  try {
    let team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Make sure user owns team
    if (name) teamDetailFields.name = name;
    if (description) teamDetailFields.description = description;
    if (department) teamDetailFields.department = department;
    if (lead) teamFields.lead = lead;
    if (list) teamFields.list = [...list];

    await TeamDetail.findByIdAndUpdate(
      team.toObject().detail,
      { $set: teamDetailFields },
      { new: true }
    );
    await User.updateMany({ team: team.toObject().detail }, { team: null });

    list.push(lead);
    for (const item of list) {
      await User.findByIdAndUpdate(
        item,
        { $set: { team: team.toObject().detail } },
        { new: true }
      );
    }

    team = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: teamFields },
      { new: true }
    ).populate({
      path: 'detail',
      populate: { path: 'department', model: 'department' },
    });
    //   .populate('list')
    //   .populate('lead');

    res.json({ data: team, message: 'Team updated' });
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/teams/:id
// @desc    Delete team
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team not found' });
    await TeamDetail.findByIdAndRemove(team.toObject().detail);
    await Team.findByIdAndRemove(req.params.id);
    await User.updateMany({ team: team.toObject().detail }, { team: null });

    res.json({ message: 'Team removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
