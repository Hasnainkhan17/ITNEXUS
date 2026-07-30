const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, required: true },
  shortBio: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 50 && v.length <= 150;
      },
      message: props => `shortBio length (${props.value.length}) must be strictly between 50 and 150 characters!`
    }
  },
  fullBio: { type: String },
  linkedinUrl: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
