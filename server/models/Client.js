const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  logoUrl: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
