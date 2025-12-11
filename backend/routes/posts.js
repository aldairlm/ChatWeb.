const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 }).lean();
  const postsWithComments = await Promise.all(posts.map(async p => {
    const comments = await Comment.find({ post: p._id }).populate('author', 'username').sort({ createdAt: 1 }).lean();
    return { ...p, comments };
  }));
  res.json(postsWithComments);
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({ author: req.user.id, content });
    await post.populate('author', 'username');
    // emit realtime event
    try { req.app.get('io')?.emit('post created', post); } catch(e){}
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({ post: req.params.id, author: req.user.id, content });
    await comment.populate('author', 'username');
    // emit realtime event with comment and post id
    try { req.app.get('io')?.emit('post commented', { postId: req.params.id, comment }); } catch(e){}
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/react', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user.id;
    const idx = post.reactions.findIndex(r => r.toString() === userId);
    if (idx >= 0) post.reactions.splice(idx, 1);
    else post.reactions.push(userId);
    await post.save();
    const payload = { postId: post._id, reactionsCount: post.reactions.length, reacted: idx < 0 };
    try { req.app.get('io')?.emit('post reacted', payload); } catch(e){}
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
