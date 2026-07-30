const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true, default: 'Code' },
  displayOrder: { type: Number, default: 0 },
  technologies: { type: [String], default: [] },
  deliverables: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
