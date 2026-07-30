const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// @route   GET api/team
// @desc    Get all active team members (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await Team.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/team
// @desc    Add a team member
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, role, imageUrl, shortBio, fullBio, displayOrder, isActive } = req.body;

  try {
    const newMember = new Team({
      name,
      role,
      imageUrl,
      shortBio,
      fullBio,
      displayOrder,
      isActive
    });

    const member = await newMember.save();
    res.json(member);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/team/:id
// @desc    Update a team member
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, role, imageUrl, shortBio, fullBio, displayOrder, isActive } = req.body;

  try {
    let member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member profile not found' });
    }

    member.name = name || member.name;
    member.role = role || member.role;
    member.imageUrl = imageUrl || member.imageUrl;
    member.shortBio = shortBio || member.shortBio;
    member.fullBio = fullBio !== undefined ? fullBio : member.fullBio;
    member.displayOrder = displayOrder !== undefined ? displayOrder : member.displayOrder;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    await member.save();
    res.json(member);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/team/:id
// @desc    Delete a team member profile
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member profile not found' });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member profile removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
