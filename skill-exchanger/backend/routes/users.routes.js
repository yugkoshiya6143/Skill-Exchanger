const express = require('express');
const router = express.Router();
const { searchUsers, getUserById } = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

// GET /api/users/search?skill=skillname
router.get('/search', auth, searchUsers);

// GET /api/users/:userId
router.get('/:userId', auth, getUserById);

module.exports = router;
