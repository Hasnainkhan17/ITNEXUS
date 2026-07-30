const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// @route   GET api/blogs
// @desc    Get all blog posts & case studies (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/blogs/:slug
// @desc    Get a single blog post by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/blogs
// @desc    Add a blog post / case study
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, type, category, shortDescription, content, author, readTime, imageUrl, displayOrder } = req.body;

  if (!title || !type || !category || !shortDescription || !content) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  // Generate unique slug
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  try {
    // Check if slug is unique, append timestamp if duplicate
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const newBlog = new Blog({
      title,
      slug,
      type,
      category,
      shortDescription,
      content,
      author: author || undefined,
      readTime: readTime || undefined,
      imageUrl: imageUrl || undefined,
      displayOrder: displayOrder !== undefined ? displayOrder : 0
    });

    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog post / case study
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
