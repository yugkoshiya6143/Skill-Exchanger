const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const auth = require('../middlewares/auth');

// GET /api/profile/me
router.get('/me', auth, getProfile);

// POST /api/profile/update
router.post('/update', auth, updateProfile);

module.exports = router;
