const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getIncomingRequests,
  getSentRequests,
  updateRequestStatus
} = require('../controllers/request.controller');
const auth = require('../middlewares/auth');

// POST /api/requests/send
router.post('/send', auth, sendRequest);

// GET /api/requests/incoming
router.get('/incoming', auth, getIncomingRequests);

// GET /api/requests/sent
router.get('/sent', auth, getSentRequests);

// POST /api/requests/status
router.post('/status', auth, updateRequestStatus);

module.exports = router;
