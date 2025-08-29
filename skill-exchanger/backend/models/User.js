// Import required packages
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create user schema (structure) for the database
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Remove extra spaces
    minlength: [2, 'Name must be at least 2 characters']
  },

  // User's email address (must be unique)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // No two users can have same email
    lowercase: true, // Convert to lowercase
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  // User's password (will be encrypted)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // User's bio/description (optional)
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: '' // Empty by default
  },

  // Array of user's skills
  skills: [{
    type: String,
    trim: true // Remove extra spaces
  }],

  // User's average rating (0-5 stars)
  avgRating: {
    type: Number,
    default: 0, // Start with 0 rating
    min: 0,
    max: 5
  },

  // Total number of ratings received
  ratingsCount: {
    type: Number,
    default: 0 // Start with 0 ratings
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Encrypt password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or changed
  if (!this.isModified('password')) return next();

  // Create salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches stored password
userSchema.methods.comparePassword = async function(password) {
  // Compare plain text password with hashed password
  return await bcrypt.compare(password, this.password);
};

// Export the User model so other files can use it
module.exports = mongoose.model('User', userSchema);
