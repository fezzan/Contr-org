const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Chat = require('../models/Chat');

// @route   GET api/chat
// @desc    Get a user's all chat
// @access  Private
router.get('/:room', auth, async (req, res) => {
  try {
    const room = req.params.room;
    const messages = await Chat.find({ room })
      .populate({
        path: 'author',
        select: 'name email role department',
        populate: { path: 'department', select: 'name' },
      })
      .populate({
        path: 'room',
        select: 'members',
        populate: { path: 'members', select: 'name role email' },
      });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chat
// @desc    Add new chat
// @access  Private
// router.post('/', auth, async (req, res) => {
//   const { name, description } = req.body;
//   try {
//     const newChat = new Chat({
//       name,
//       description,
//     });
//     let chat = await newChat.save();

//     res.json({ data: chat, message: 'Chat added' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   PUT api/chat/:id
// @desc    Update chat
// @access  Private
// router.put('/:id', auth, async (req, res) => {
//   const { name, description } = req.body;
//   // Build chat object
//   const departmentFields = {};

//   try {
//     let chat = await Chat.findById(req.params.id);

//     if (!chat) return res.status(404).json({ message: 'Chat not found' });

//     // Make sure user owns chat
//     if (name) departmentFields.name = name;
//     if (description) departmentFields.description = description;

//     chat = await Chat.findByIdAndUpdate(
//       req.params.id,
//       { $set: departmentFields },
//       { new: true }
//     );

//     res.json({ data: chat, message: 'Chat updated' });
//   } catch (err) {
//     console.error(er.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route   DELETE api/chat/:id
// @desc    Delete chat
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    await Chat.findByIdAndRemove(req.params.id);

    res.json({ message: 'Chat removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
