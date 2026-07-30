const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

// @route   POST api/inquiries
// @desc    Submit a client inquiry (public)
// @access  Public
router.post('/', async (req, res) => {
  const { clientName, clientEmail, phone, projectScope, message } = req.body;

  // Simple email validation
  if (!clientEmail || !clientEmail.includes('@')) {
    return res.status(400).json({ message: 'A valid email address is required' });
  }

  if (!clientName || !message) {
    return res.status(400).json({ message: 'Name and message details are required' });
  }

  try {
    const newInquiry = new Inquiry({
      clientName,
      clientEmail,
      phone,
      projectScope,
      message,
      status: 'New'
    });

    const inquiry = await newInquiry.save();
    res.json(inquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/inquiries
// @desc    Get all inquiries (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/inquiries/:id
// @desc    Update inquiry status workflow state
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  if (!status || !['New', 'Reviewed', 'Responded'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status workflow state' });
  }

  try {
    let inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/inquiries/:id
// @desc    Delete an inquiry log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry log removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
