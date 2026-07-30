const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET api/projects
// @desc    Get all projects (public) with optional featured limiter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const isFeatured = req.query.featured === 'true';
    
    let query = {};
    if (isFeatured) {
      query.isFeaturedOnHome = true;
    }

    let projectsQuery = Project.find(query).sort({ displayOrder: 1, createdAt: -1 });
    
    // Enforce the 6-item limit for homepage query
    if (isFeatured) {
      projectsQuery = projectsQuery.limit(6);
    }

    const projects = await projectsQuery;
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:slug
// @desc    Get project by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, slug, thumbnailUrl, category, shortDescription, fullDescription, isFeaturedOnHome, displayOrder } = req.body;

  try {
    const newProject = new Project({
      title,
      slug,
      thumbnailUrl,
      category,
      shortDescription,
      fullDescription,
      isFeaturedOnHome,
      displayOrder
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, slug, thumbnailUrl, category, shortDescription, fullDescription, isFeaturedOnHome, displayOrder } = req.body;

  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.slug = slug || project.slug;
    project.thumbnailUrl = thumbnailUrl || project.thumbnailUrl;
    project.category = category || project.category;
    project.shortDescription = shortDescription || project.shortDescription;
    project.fullDescription = fullDescription !== undefined ? fullDescription : project.fullDescription;
    project.isFeaturedOnHome = isFeaturedOnHome !== undefined ? isFeaturedOnHome : project.isFeaturedOnHome;
    project.displayOrder = displayOrder !== undefined ? displayOrder : project.displayOrder;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
