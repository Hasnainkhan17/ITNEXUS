const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Blog', 'Case Study'] },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'ITNEXUS Team' },
  readTime: { type: String, default: '5 min read' },
  imageUrl: { type: String, default: 'itnexus-mark-color-512px.png' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
