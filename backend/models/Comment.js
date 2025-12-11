const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
