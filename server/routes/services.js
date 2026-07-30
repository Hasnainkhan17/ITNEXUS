const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// @route   GET api/services
// @desc    Get all services (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/services
// @desc    Add a service
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, icon, displayOrder, technologies, deliverables } = req.body;

  try {
    const newService = new Service({
      title,
      description,
      icon,
      displayOrder,
      technologies: Array.isArray(technologies) ? technologies : [],
      deliverables: Array.isArray(deliverables) ? deliverables : []
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, icon, displayOrder, technologies, deliverables } = req.body;

  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.icon = icon || service.icon;
    service.displayOrder = displayOrder !== undefined ? displayOrder : service.displayOrder;
    if (technologies !== undefined) service.technologies = technologies;
    if (deliverables !== undefined) service.deliverables = deliverables;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
