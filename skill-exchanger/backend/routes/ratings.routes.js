const express = require('express');
const router = express.Router();
const { giveRating, getUserRatings, getRatingsGivenByUser } = require('../controllers/rating.controller');
const auth = require('../middlewares/auth');

// POST /api/ratings/give - Submit a rating for another user
router.post('/give', auth, giveRating);

// GET /api/ratings/user/:userId - Get ratings received by a user
router.get('/user/:userId', auth, getUserRatings);

// GET /api/ratings/given/:userId - Get ratings given by a user
router.get('/given/:userId', auth, getRatingsGivenByUser);

module.exports = router;
