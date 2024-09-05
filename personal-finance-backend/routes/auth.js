const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

async function sendConfirmationEmail(email, confirmUrl) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: '"Personal Finance App" <noreply@personalfinance.com>',
    to: email,
    subject: "Confirm Your Email",
    text: `Please confirm your email by clicking on the following link within the next 15 minutes: ${confirmUrl}`,
    html: `<p>Please confirm your email by clicking on the following link within the next 15 minutes: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isConfirmed) {
        // If user exists but is not confirmed, delete the old user
        await User.findByIdAndDelete(user._id);
      } else {
        return res.status(400).json({ msg: 'User already exists' });
      }
    }

    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    
    user = new User({
      email,
      password,
      confirmationToken,
      confirmationExpires: expirationTime
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Send confirmation email
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm/${confirmationToken}`;
    await sendConfirmationEmail(email, confirmUrl);

    res.status(201).json({ msg: 'Please check your email to confirm your account' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if the user's email is confirmed
    if (!user.isConfirmed) {
      return res.status(400).json({ msg: 'Please confirm your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, email: user.email });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/confirm/:token', async (req, res) => {
  console.log('Received confirmation request for token:', req.params.token);
  try {
    const user = await User.findOne({
      confirmationToken: req.params.token,
      confirmationExpires: { $gt: new Date() }
    });

    console.log('User found:', user);

    if (!user) {
      console.log('No user found or token expired');
      return res.status(400).json({ msg: 'Invalid or expired confirmation link' });
    }


    if (user.isConfirmed) {
      console.log('User already confirmed');
      return res.status(400).json({ msg: 'Email already confirmed' });
    }

    user.isConfirmed = true;
    user.confirmationToken = undefined;
    user.confirmationExpires = undefined;

    try {
      const savedUser = await user.save();
      console.log('User confirmed successfully:', savedUser);
      res.json({ msg: 'Email confirmed successfully' });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      res.status(500).json({ msg: 'Error confirming email' });
    }
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;