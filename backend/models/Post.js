const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reactions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Post', postSchema);
