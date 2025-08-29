const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message.controller');
const auth = require('../middlewares/auth');

// POST /api/messages/send
router.post('/send', auth, sendMessage);

// GET /api/messages/list?requestId=id
router.get('/list', auth, getMessages);

module.exports = router;
