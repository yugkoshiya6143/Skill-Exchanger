const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true
  },
  skillRequested: {
    type: String,
    required: [true, 'Skill requested is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot exceed 300 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Prevent duplicate requests
requestSchema.index({ senderId: 1, receiverId: 1, skillOffered: 1, skillRequested: 1 }, { unique: true });

module.exports = mongoose.model('Request', requestSchema);
