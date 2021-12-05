const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Department = require('../models/Department');

// @route   GET api/departments
// @desc    Get a user's all department
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const department = await Department.find();
    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/departments
// @desc    Add new department
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newDepartment = new Department({
      name,
      description,
    });
    let department = await newDepartment.save();

    res.json({ data: department, message: 'Department added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/departments/:id
// @desc    Update department
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  // Build department object
  const departmentFields = {};

  try {
    let department = await Department.findById(req.params.id);

    if (!department)
      return res.status(404).json({ message: 'Department not found' });

    // Make sure user owns department
    if (name) departmentFields.name = name;
    if (description) departmentFields.description = description;

    department = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: departmentFields },
      { new: true }
    );

    res.json({ data: department, message: 'Department updated' });
  } catch (err) {
    console.error(er.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/departments/:id
// @desc    Delete department
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);

    if (!department)
      return res.status(404).json({ message: 'Department not found' });

    await Department.findByIdAndRemove(req.params.id);

    res.json({ message: 'Department removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
