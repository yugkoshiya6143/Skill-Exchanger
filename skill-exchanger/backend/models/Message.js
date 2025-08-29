const mongoose = require('mongoose');
const config = require('../config');

const messageSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
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
  message: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [config.MAX_MESSAGE_LEN, `Message cannot exceed ${config.MAX_MESSAGE_LEN} characters`],
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ requestId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
