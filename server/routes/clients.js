const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// @route   GET api/clients
// @desc    Get all active clients (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/clients
// @desc    Add a client logo
// @access  Private
router.post('/', auth, async (req, res) => {
  const { clientName, logoUrl, displayOrder, isActive } = req.body;

  try {
    const newClient = new Client({
      clientName,
      logoUrl,
      displayOrder,
      isActive
    });

    const client = await newClient.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/clients/:id
// @desc    Update a client logo
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { clientName, logoUrl, displayOrder, isActive } = req.body;

  try {
    let client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client profile not found' });
    }

    client.clientName = clientName || client.clientName;
    client.logoUrl = logoUrl || client.logoUrl;
    client.displayOrder = displayOrder !== undefined ? displayOrder : client.displayOrder;
    client.isActive = isActive !== undefined ? isActive : client.isActive;

    await client.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/clients/:id
// @desc    Delete a client logo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client profile not found' });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client profile removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
