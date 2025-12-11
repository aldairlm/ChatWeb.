const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    console.log('[AUTH] register body:', req.body);
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'changeme_super_secret');
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('[AUTH] login body:', req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'changeme_super_secret');
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
