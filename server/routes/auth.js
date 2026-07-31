const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Admin Login)
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'itnexus_super_secret_jwt_key_123!',
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/verify
// @desc    Verify current JWT token
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Send OTP to registered email for password recovery
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;

  try {
    // Find by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Account with that username or email not found' });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await user.save();

    const emailSubject = 'ITNEXUS Console Password Reset OTP';
    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #334155; line-height: 1.6;">
          You are receiving this email because a password reset request was initiated for your ITNEXUS Console account.
        </p>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0; border: 1px dashed #cbd5e1;">
          <p style="margin: 0 0 10px 0; color: #475569; font-size: 14px; text-transform: uppercase; font-weight: bold; tracking-wider;">Your OTP Code</p>
          <span style="font-size: 36px; font-weight: 800; color: #1d4ed8; letter-spacing: 6px; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #dc2626; font-size: 14px; font-weight: bold;">
          This code is only valid for 15 minutes.
        </p>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 20px;">
          If you did not request this password reset, please ignore this email or secure your account credentials immediately.
        </p>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          This email was sent automatically from the ITNEXUS Console System.
        </p>
      </div>
    `;

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailSubject,
      html: emailBody
    });

    if (emailSent) {
      res.json({ message: 'OTP sent to registered email' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP email. Please ensure SMTP configuration is correct.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/verify-otp
// @desc    Verify the reset password OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using verified OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { username, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset OTP fields
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now login with your new password.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/update-account
// @desc    Update admin username and/or password
// @access  Private
router.put('/update-account', auth, async (req, res) => {
  const { newUsername, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUsername) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = newUsername;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: 'Account settings updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
