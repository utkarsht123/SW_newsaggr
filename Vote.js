const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only vote once per article
VoteSchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema); 