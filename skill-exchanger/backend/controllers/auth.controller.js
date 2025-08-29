// Import required packages
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Helper function to create JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
};

// Register new user
const register = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password, skills } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Clean up skills array (remove empty spaces)
    const cleanSkills = skills.map(skill => skill.trim()).filter(skill => skill);

    // Create new user object
    const newUser = new User({
      name,
      email,
      password, // Will be automatically encrypted by User model
      skills: cleanSkills
    });

    // Save user to database
    await newUser.save();

    // Create login token for the new user
    const token = generateToken(newUser._id);

    // Send success response with user data and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        skills: newUser.skills,
        avgRating: newUser.avgRating,
        ratingsCount: newUser.ratingsCount
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    // Get email and password from request
    const { email, password } = req.body;

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create login token
    const token = generateToken(user._id);

    // Send success response with user data and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        avgRating: user.avgRating,
        ratingsCount: user.ratingsCount
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current logged-in user's information
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = req.user;

    // Send user information (without password)
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        avgRating: user.avgRating,
        ratingsCount: user.ratingsCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error getting user info' });
  }
};

// Export all functions so routes can use them
module.exports = {
  register,
  login,
  getMe
};
