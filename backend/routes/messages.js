const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get recent messages (default last 100)
router.get('/', async (req, res) => {
  try {
    // Pagination: page=1 returns latest `limit` messages
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    // get messages newest first, skip according to page
    const messages = await Message.find().populate('user', 'username').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    // reverse so oldest->newest in the returned array
    const ordered = messages.reverse().map(m => ({ id: m._id, user: m.user?.username || 'anon', content: m.content, createdAt: m.createdAt }));
    // also return pagination info
    const total = await Message.countDocuments();
    res.json({ page, limit, total, messages: ordered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
