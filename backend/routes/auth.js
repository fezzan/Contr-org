const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'lynxrentalapp@gmail.com',
    pass: 'eruqynoypgqmjznm',
  },
  tls: {
    rejectUnauthorized: false,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// @route   POST api/auth
// @desc    Forget user password
// @access  Public
router.post('/forget-password', async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: 'User Does Not exist...',
      });
      return;
    } else {
      const payload = {
        id: user._id,
        expiry: Date.now(),
      };
      var encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        'qazxsw!@#edcvfr)(*'
      ).toString();

      const url = 'http://localhost:3000/reset/';
      const mailData = {
        from: 'Operator',
        to: req.body.email,
        subject: 'Forgot Password',
        text: 'Reset Link',
        html: `<b>Hey there! </b><br> Please <a target='_blank' href='${url}${encryptedUser}'>Click Here!</a> to reset your password
                 <br/>`,
      };
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          res.status(400).json({
            success: false,
            message: error,
          });
        } else {
          res.json({
            success: true,
            message: 'A reset link has been sent to your email',
          });
        }
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

// @route   POST api/auth
// @desc    Reset user password
// @access  Public
router.put('/reset-password', async (req, res) => {
  try {
    const newPassword = req.body.password;
    const id = req.body.id;
    const bytes = CryptoJS.AES.decrypt(id, 'qazxsw!@#edcvfr)(*');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (Date.now() > decryptedData.expiry + 60 * 60 * 1000) {
      res.status(400).json({
        success: false,
        message: 'The Link Has Expired',
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);
      await User.findByIdAndUpdate(
        decryptedData.id,
        { $set: { password } },
        { new: true }
      );
      res.json({
        success: true,
        message: 'Password changed Successfully',
      });
    }
  } catch (ex) {
    res.status(500).send({
      success: false,
      message: ex.toString(),
    });
  }
});

module.exports = router;
