const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Project = require('../models/Project');

// @route   GET api/projects
// @desc    Get a user's all project
// @access  Private
router.get('/:role', auth, async (req, res) => {
  try {
    let project = {};
    if (req.params.role === 'admin') {
      project = await Project.find({ reporter: req.user.id })
        .populate({ path: 'assignee', populate: { path: 'department' } })
        .populate('reporter', '-password')
        .sort({
          date: -1,
        });
    } else {
      project = await Project.find({ assignee: req.params.role })
        .populate({ path: 'assignee', populate: { path: 'department' } })
        .populate('reporter', '-password')
        .sort({
          date: -1,
        });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get a admin's all project
// @access  Private
// router.get('/admin', auth, async (req, res) => {
//   try {
//     const project = await Project.find({ reporter: req.user.id })
//       .populate('assignee', '-password')
//       .populate('reporter', '-password')
//       .sort({
//         date: -1,
//       });
//     res.json(project);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   POST api/projects
// @desc    Add new project
// @access  Private
router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, assignee, startDate, endDate } = req.body;

    try {
      const newProject = new Project({
        name,
        description,
        assignee,
        startDate,
        endDate,
        reporter: req.user.id,
      });
      let project = await newProject.save();
      project = await Project.populate(project, {
        path: 'reporter',
        select: '-password',
      });
      project = await Project.populate(project, {
        path: 'assignee',
        populate: { path: 'department' },
      });
      res.json({ data: project, message: 'Project added' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, assignee, status, description, startDate, endDate, team } =
    req.body;
  // Build project object
  const projectFields = {};

  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Make sure user owns project
    if (req.user.id === project.toObject().reporter) {
      if (name) projectFields.name = name;
      if (assignee) projectFields.assignee = assignee;
      if (description) projectFields.description = description;
      if (startDate) projectFields.startDate = startDate;
      if (endDate) projectFields.endDate = endDate;
    } else if (team === project.toObject().assignee?.toString()) {
      if (status) projectFields.status = status;
      if (status === 'Completed') projectFields.completedAt = Date.now();
      else projectFields.completedAt = null;
    } else {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    )
      .populate('reporter', '-password')
      .populate({ path: 'assignee', populate: { path: 'department' } });

    // project = await Project.populate(project, {
    //   path: 'reporter',
    //   select: '-password',
    // });
    // project = await Project.populate(project, {
    //   path: 'assignee',
    //   select: '-password',
    // });

    res.json({ data: project, message: 'Project updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Make sure user owns project
    if (project.reporter.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndRemove(req.params.id);

    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
