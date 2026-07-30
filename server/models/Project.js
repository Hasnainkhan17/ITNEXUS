const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  thumbnailUrl: { type: String, required: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  timeline: { type: String, default: '' },
  technologies: { type: [String], default: [] },
  projectUrl: { type: String, default: '' },
  isFeaturedOnHome: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
