const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Room = require('../models/Room');

// @route   GET api/rooms
// @desc    Get a user's all room
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user.id }).populate({
      path: 'members',
      select: 'name email role department',
      populate: { path: 'department', select: 'name' },
    });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/rooms
// @desc    Add new room
// @access  Private
// router.post('/', auth, async (req, res) => {
//   const { name, description } = req.body;
//   try {
//     const newroom = new Room({
//       name,
//       description,
//     });
//     let room = await newroom.save();

//     res.json({ data: room, message: 'Room added' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   PUT api/rooms/:id
// @desc    Update room
// @access  Private
// router.put('/:id', auth, async (req, res) => {
//   const { name, description } = req.body;
//   // Build room object
//   const departmentFields = {};

//   try {
//     let room = await Room.findById(req.params.id);

//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     // Make sure user owns room
//     if (name) departmentFields.name = name;
//     if (description) departmentFields.description = description;

//     room = await Room.findByIdAndUpdate(
//       req.params.id,
//       { $set: departmentFields },
//       { new: true }
//     );

//     res.json({ data: room, message: 'Room updated' });
//   } catch (err) {
//     console.error(er.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   DELETE api/rooms/:id
// @desc    Delete room
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: 'Room not found' });

    await Room.findByIdAndRemove(req.params.id);

    res.json({ message: 'Room removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
