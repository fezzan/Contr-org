const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .populate('department');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   GET api/users/all
// @desc    Get all users
// @access  Private
router.get('/all/:query', auth, async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'si' } },
        { email: { $regex: query, $options: 'si' } },
        { role: { $regex: query, $options: 'si' } },
      ],
      _id: { $ne: req.user.id },
    }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   GET api/users
// @desc    Get all leads of a department
// @access  Private
router.get('/leads/department/:department', auth, async (req, res) => {
  try {
    const users = await User.find({
      role: 'Lead',
      department: req.params.department,
    }).select('-password');
    // .populate('department');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   GET api/users
// @desc    Get all non-leads of a department
// @access  Private
router.get('/members/department/:department', auth, async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ['admin', 'HOD', 'Lead'] },
      department: req.params.department,
    }).select('-password');
    // .populate('department');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   GET api/users
// @desc    Get all non-leads of a team
// @access  Private
router.get('/members/team/:team', auth, async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ['admin', 'HOD', 'Lead'] },
      team: req.params.team,
    }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   PUT api/users/employee
// @desc    Update an employee
// @access  Private
router.put('/employee/:id', auth, async (req, res) => {
  const { name, password, role, email, department } = req.body;

  try {
    const employeeFields = {};
    const salt = await bcrypt.genSalt(10);
    console.log(req.body);
    if (name) employeeFields.name = name;
    if (password) employeeFields.password = await bcrypt.hash(password, salt);
    if (role) employeeFields.role = role;
    if (department) employeeFields.department = department;
    if (email) employeeFields.email = email;
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Employee not found' });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    )
      .select('-password')
      .populate('department');
    res.json({ message: 'Employee updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   PUT api/users
// @desc    Update user
// @access  Private
router.put('/', auth, async (req, res) => {
  const { name, password } = req.body;

  try {
    const employeeFields = {};
    const salt = await bcrypt.genSalt(10);

    if (name) employeeFields.name = name;
    if (password) employeeFields.password = await bcrypt.hash(password, salt);
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Not Authorized' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: employeeFields },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, department } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
        role,
        department,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      user = await user.save();
      user = await User.populate(user, {
        path: 'department',
      });
      // await user.select('-password');
      user = user.toObject();
      delete user.password;
      res.json({ message: 'User Created Succesfully', user });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ messgae: 'Server Error' });
    }
  }
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'Employee not found' });

    await User.findByIdAndRemove(req.params.id);

    res.json({ message: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ messgae: 'Server Error' });
  }
});

module.exports = router;
