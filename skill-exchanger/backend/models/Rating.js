const mongoose = require('mongoose');

// Schema for storing user ratings
const ratingSchema = new mongoose.Schema({
  // Which skill exchange request this rating is for
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  // Who gave this rating
  raterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Who received this rating
  rateeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Star rating (1-5)
  stars: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  // Optional feedback text
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create index to prevent duplicate ratings for same request by same user
// This ensures one user can only rate one specific skill exchange once
// But they can rate the same person multiple times for different exchanges
ratingSchema.index({ requestId: 1, raterId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
