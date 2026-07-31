const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const auth = require('../middleware/auth');

// @route   GET api/page-contents
// @desc    Get page settings configuration
// @access  Public
router.get('/', async (req, res) => {
  try {
    let content = await PageContent.findOne();
    if (!content) {
      // Create with schema defaults
      content = new PageContent({});
      await content.save();
    }
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/page-contents
// @desc    Update page settings configurations
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    let content = await PageContent.findOne();
    if (!content) {
      content = new PageContent({});
    }

    const fields = [
      'homeHeroBgImage',
      'homeHeroHeading',
      'homeHeroParagraph',
      'homeAboutHeading',
      'homeAboutParagraph',
      'homeStatsCountries',
      'homeStatsProjects',
      'homeStatsPrecision',
      'aboutHeroHeading',
      'aboutHeroParagraph',
      'aboutNarrativeHeading',
      'aboutNarrativeParagraph1',
      'aboutNarrativeParagraph2',
      'aboutStatsCountries',
      'aboutStatsClients',
      'aboutStatsTelemetry',
      'aboutValues',
      'aboutVisionStatement'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    });

    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
