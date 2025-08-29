const Message = require('../models/Message');
const Request = require('../models/Request');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { requestId, message } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!requestId || !message) {
      return res.status(400).json({ message: 'Request ID and message are required' });
    }

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if request is accepted (only accepted requests can have messages)
    if (request.status !== 'Accepted' && request.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only message for accepted requests' });
    }

    // Check if user is part of this request
    const isSender = request.senderId.toString() === senderId.toString();
    const isReceiver = request.receiverId.toString() === senderId.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to send messages for this request' });
    }

    // Determine receiver ID
    const receiverId = isSender ? request.receiverId : request.senderId;

    // Create new message
    const newMessage = new Message({
      requestId,
      senderId,
      receiverId,
      message
    });

    await newMessage.save();
    await newMessage.populate('senderId receiverId', 'name');

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: newMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a request
const getMessages = async (req, res) => {
  try {
    const { requestId } = req.query;
    const userId = req.user._id;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is part of this request
    const isSender = request.senderId.toString() === userId.toString();
    const isReceiver = request.receiverId.toString() === userId.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: 'Not authorized to view messages for this request' });
    }

    // Get messages
    const messages = await Message.find({ requestId })
      .populate('senderId receiverId', 'name')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
