const Request = require('../models/Request');
const User = require('../models/User');

// Send skill exchange request
const sendRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      senderId,
      receiverId,
      skillOffered,
      skillRequested,
      status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    // Create new request
    const newRequest = new Request({
      senderId,
      receiverId,
      skillOffered,
      skillRequested,
      message: message || ''
    });

    await newRequest.save();
    await newRequest.populate('senderId receiverId', 'name email skills');

    res.status(201).json({
      message: 'Request sent successfully',
      request: newRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get incoming requests
const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Request.find({ receiverId: userId })
      .populate('senderId', 'name email skills avgRating')
      .sort({ createdAt: -1 });

    // Ensure consistent ID field names
    const normalizedRequests = requests.map(request => {
      const requestObj = request.toObject();
      if (requestObj.senderId && requestObj.senderId._id) {
        requestObj.senderId.id = requestObj.senderId._id;
      }
      return requestObj;
    });

    res.json({ requests: normalizedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sent requests
const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Request.find({ senderId: userId })
      .populate('receiverId', 'name email skills avgRating')
      .sort({ createdAt: -1 });

    // Ensure consistent ID field names
    const normalizedRequests = requests.map(request => {
      const requestObj = request.toObject();
      if (requestObj.receiverId && requestObj.receiverId._id) {
        requestObj.receiverId.id = requestObj.receiverId._id;
      }
      return requestObj;
    });

    res.json({ requests: normalizedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const userId = req.user._id;

    // Validate status
    if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is authorized to update this request
    const isReceiver = request.receiverId.toString() === userId.toString();
    const isSender = request.senderId.toString() === userId.toString();

    if (!isReceiver && !isSender) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only receiver can accept/reject, both can mark as completed
    if ((status === 'Accepted' || status === 'Rejected') && !isReceiver) {
      return res.status(403).json({ message: 'Only receiver can accept/reject requests' });
    }

    // Update request
    request.status = status;
    await request.save();
    await request.populate('senderId receiverId', 'name email skills');

    res.json({
      message: 'Request status updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendRequest,
  getIncomingRequests,
  getSentRequests,
  updateRequestStatus
};
