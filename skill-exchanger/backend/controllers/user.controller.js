const User = require('../models/User');

// Search users by skill
const searchUsers = async (req, res) => {
  try {
    const { skill } = req.query;
    const currentUserId = req.user._id;

    if (!skill) {
      return res.status(400).json({ message: 'Skill parameter is required' });
    }

    // Search for users with the specified skill (case-insensitive)
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      skills: { $regex: skill, $options: 'i' }
    }).select('-password').limit(20);

    res.json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        avgRating: user.avgRating,
        ratingsCount: user.ratingsCount
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        skills: user.skills,
        avgRating: user.avgRating,
        ratingsCount: user.ratingsCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  searchUsers,
  getUserById
};
