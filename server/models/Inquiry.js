const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  phone: { type: String },
  projectScope: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Reviewed', 'Responded'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
