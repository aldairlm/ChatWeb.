const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme_super_secret');
    req.user = payload; // { id, username }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
