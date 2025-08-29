const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { bio, skills } = req.body;
    const userId = req.user._id;

    // Validate skills
    if (skills && (!Array.isArray(skills) || skills.length === 0)) {
      return res.status(400).json({ message: 'At least one skill is required' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio: bio || '',
        skills: skills ? skills.map(skill => skill.trim()).filter(skill => skill) : req.user.skills
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        avgRating: updatedUser.avgRating,
        ratingsCount: updatedUser.ratingsCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
