import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ArticleItem = ({ article }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in to upvote articles');
      return;
    }
    
    try {
      const res = await axios.post(`/api/articles/${article._id}/upvote`);
      // Update the article upvote count in the UI
      article.upvotes = res.data.upvotes;
      // Force a re-render
      window.location.reload();
    } catch (err) {
      console.error('Error upvoting article:', err);
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      }
    }
  };
  
  return (
    <div className="article-item">
      <div className="upvote-section">
        <button 
          className="upvote-btn" 
          onClick={handleUpvote}
          disabled={!isAuthenticated}
        >
          ▲
        </button>
        <span className="upvote-count">{article.upvotes}</span>
      </div>
      <div className="article-content">
        <h3>
          <Link to={`/articles/${article._id}`}>{article.title}</Link>
        </h3>
        <p className="article-summary">{article.summary}</p>
        <div className="article-meta">
          <span>By {article.author.username}</span>
          <span>Posted on {new Date(article.createdAt).toLocaleDateString()}</span>
          {article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleItem; 