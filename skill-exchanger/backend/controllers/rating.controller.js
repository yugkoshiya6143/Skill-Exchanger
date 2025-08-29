const Rating = require('../models/Rating');
const Request = require('../models/Request');
const User = require('../models/User');

// Give rating - simplified and fixed to allow multiple ratings
const giveRating = async (req, res) => {
  try {
    // Get data from request body and current user
    const { requestId, rateeId, stars, feedback } = req.body;
    const raterId = req.user._id;

    // Step 1: Check if all required information is provided
    if (!requestId || !rateeId || !stars) {
      return res.status(400).json({
        message: 'Request ID, ratee ID, and stars are required'
      });
    }

    // Step 2: Check if stars rating is valid (1-5)
    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        message: 'Stars must be between 1 and 5'
      });
    }

    // Step 3: Find the skill exchange request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    // Step 4: Check if the skill exchange is completed
    if (request.status !== 'Completed') {
      return res.status(400).json({
        message: 'Can only rate completed skill exchanges'
      });
    }

    // Step 5: Check if current user is part of this skill exchange
    const userIsSender = request.senderId.toString() === raterId.toString();
    const userIsReceiver = request.receiverId.toString() === raterId.toString();
    const userIsPartOfRequest = userIsSender || userIsReceiver;

    if (!userIsPartOfRequest) {
      return res.status(403).json({
        message: 'You can only rate skill exchanges you participated in'
      });
    }

    // Step 6: Check if ratee is the other person in the skill exchange
    const otherPersonId = userIsSender ? request.receiverId.toString() : request.senderId.toString();
    if (rateeId !== otherPersonId) {
      return res.status(400).json({
        message: 'You can only rate the other person in this skill exchange'
      });
    }

    // Step 7: Check if user already rated this specific request
    // Note: Users can rate the same person multiple times for different requests
    const existingRating = await Rating.findOne({
      requestId: requestId,
      raterId: raterId
    });

    if (existingRating) {
      return res.status(400).json({
        message: 'You have already rated this skill exchange'
      });
    }

    // Step 8: Create the new rating
    const newRating = new Rating({
      requestId: requestId,
      raterId: raterId,
      rateeId: rateeId,
      stars: stars,
      feedback: feedback || ''
    });

    // Step 9: Save the rating to database
    await newRating.save();

    // Step 10: Update the rated user's average rating
    await updateUserRating(rateeId);

    // Step 11: Get user names for the response
    await newRating.populate('raterId rateeId', 'name');

    // Step 12: Send success response
    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Error giving rating:', error);
    res.status(500).json({
      message: 'Server error occurred while submitting rating'
    });
  }
};

// Get user ratings - simplified version
const getUserRatings = async (req, res) => {
  try {
    // Step 1: Get user ID from the URL
    const { userId } = req.params;

    // Step 2: Check if user exists in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Step 3: Find all ratings given to this user
    // Sort by newest first (most recent ratings at top)
    const userRatings = await Rating.find({ rateeId: userId })
      .populate('raterId', 'name')  // Get the name of person who gave rating
      .populate('requestId', 'skillOffered skillRequested')  // Get skill exchange details
      .sort({ createdAt: -1 });  // Sort by newest first

    // Step 4: Send back the ratings data
    res.json({
      ratings: userRatings,
      avgRating: user.avgRating,
      ratingsCount: user.ratingsCount
    });

  } catch (error) {
    console.error('Error getting user ratings:', error);
    res.status(500).json({
      message: 'Server error occurred while getting ratings'
    });
  }
};

// Helper function to calculate and update user's average rating
const updateUserRating = async (userId) => {
  try {
    // Step 1: Get all ratings for this user
    const allUserRatings = await Rating.find({ rateeId: userId });

    // Step 2: If user has no ratings, set average to 0
    if (allUserRatings.length === 0) {
      await User.findByIdAndUpdate(userId, {
        avgRating: 0,
        ratingsCount: 0
      });
      return;
    }

    // Step 3: Calculate total stars from all ratings
    let totalStars = 0;
    for (let i = 0; i < allUserRatings.length; i++) {
      totalStars = totalStars + allUserRatings[i].stars;
    }

    // Step 4: Calculate average rating
    const averageRating = totalStars / allUserRatings.length;

    // Step 5: Round average to 1 decimal place (like 4.3, 3.7, etc.)
    const roundedAverage = Math.round(averageRating * 10) / 10;

    // Step 6: Update user's rating information in database
    await User.findByIdAndUpdate(userId, {
      avgRating: roundedAverage,
      ratingsCount: allUserRatings.length
    });

  } catch (error) {
    console.error('Error updating user rating:', error);
  }
};

// Get ratings given by a user - to check which requests they've already rated
const getRatingsGivenByUser = async (req, res) => {
  try {
    // Step 1: Get user ID from the URL
    const { userId } = req.params;

    // Step 2: Find all ratings given by this user
    const ratingsGiven = await Rating.find({ raterId: userId })
      .populate('rateeId', 'name')  // Get the name of person who received rating
      .populate('requestId', 'skillOffered skillRequested')  // Get skill exchange details
      .sort({ createdAt: -1 });  // Sort by newest first

    // Step 3: Send back the ratings data
    res.json({
      ratings: ratingsGiven
    });

  } catch (error) {
    console.error('Error getting ratings given by user:', error);
    res.status(500).json({
      message: 'Server error occurred while getting ratings given by user'
    });
  }
};

module.exports = {
  giveRating,
  getUserRatings,
  getRatingsGivenByUser
};
