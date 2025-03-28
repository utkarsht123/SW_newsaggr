const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Article = require('../models/Article');
const Vote = require('../models/Vote');

// Get all articles (sorted by upvotes)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ upvotes: -1 })
      .populate('author', 'username')
      .limit(20);
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username');
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// Create a new article (publishers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a publisher
    if (req.user.role !== 'publisher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only publishers can create articles' });
    }
    
    const { title, content, summary, tags } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      summary,
      tags: tags || [],
      author: req.user.id
    });
    
    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update an article (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user is the author or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }
    
    const { title, content, summary, tags } = req.body;
    
    article.title = title || article.title;
    article.content = content || article.content;
    article.summary = summary || article.summary;
    article.tags = tags || article.tags;
    article.updatedAt = Date.now();
    
    await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete an article (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user is the author or admin
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }
    
    await article.remove();
    
    // Remove all votes for this article
    await Vote.deleteMany({ article: req.params.id });
    
    res.json({ message: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// Upvote an article
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user has already voted
    const existingVote = await Vote.findOne({
      user: req.user.id,
      article: req.params.id
    });
    
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this article' });
    }
    
    // Create new vote
    const newVote = new Vote({
      user: req.user.id,
      article: req.params.id
    });
    
    await newVote.save();
    
    // Increment upvote count
    article.upvotes += 1;
    await article.save();
    
    res.json({ upvotes: article.upvotes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// Remove upvote from an article
router.delete('/:id/upvote', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user has voted
    const existingVote = await Vote.findOne({
      user: req.user.id,
      article: req.params.id
    });
    
    if (!existingVote) {
      return res.status(400).json({ message: 'You have not voted for this article' });
    }
    
    // Remove vote
    await existingVote.remove();
    
    // Decrement upvote count
    article.upvotes = Math.max(0, article.upvotes - 1);
    await article.save();
    
    res.json({ upvotes: article.upvotes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).send('Server error');
  }
});

// Get all articles by the current user
router.get('/user', auth, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 