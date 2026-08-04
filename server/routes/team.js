const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// Helper to sanitize team member image output
const sanitizeTeamMember = (member) => {
  const obj = member.toObject ? member.toObject() : { ...member };
  if (obj.imageUrl && obj.imageUrl.startsWith('data:')) {
    obj.imageUrl = `/api/team/${obj._id}/image`;
  }
  return obj;
};

// @route   GET api/team/:id/image
// @desc    Get dynamic binary image for a team member (cached)
// @access  Public
router.get('/:id/image', async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member || !member.imageUrl) {
      return res.status(404).send('Image not found');
    }

    if (member.imageUrl.startsWith('data:')) {
      const matches = member.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).send('Invalid base64 image data');
      }
      const mimeType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(imageBuffer);
    } else {
      return res.redirect(member.imageUrl);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/team
// @desc    Get all active team members (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await Team.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    const sanitizedTeam = team.map(sanitizeTeamMember);
    res.json(sanitizedTeam);
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
    res.json(sanitizeTeamMember(member));
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
    if (imageUrl && !imageUrl.startsWith('/api/team/')) {
      member.imageUrl = imageUrl;
    }
    member.shortBio = shortBio || member.shortBio;
    member.fullBio = fullBio !== undefined ? fullBio : member.fullBio;
    member.displayOrder = displayOrder !== undefined ? displayOrder : member.displayOrder;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    await member.save();
    res.json(sanitizeTeamMember(member));
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
