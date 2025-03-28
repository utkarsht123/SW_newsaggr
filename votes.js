const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Vote = require('../models/Vote');

// Get all votes by the current user
router.get('/user', auth, async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user.id })
      .populate({
        path: 'article',
        populate: { path: 'author', select: 'username' }
      });
    
    res.json(votes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 