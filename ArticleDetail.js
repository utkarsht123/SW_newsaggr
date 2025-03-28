import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${id}`);
        setArticle(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in to upvote articles');
      return;
    }
    
    try {
      const res = await axios.post(`/api/articles/${id}/upvote`);
      setArticle({ ...article, upvotes: res.data.upvotes });
    } catch (err) {
      console.error('Error upvoting article:', err);
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      }
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/articles/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Error deleting article:', err);
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      }
    }
  };
  
  if (loading) {
    return <p>Loading article...</p>;
  }
  
  if (!article) {
    return <p>Article not found.</p>;
  }
  
  const isAuthor = isAuthenticated && user && article.author._id === user.id;
  
  return (
    <div className="article-detail">
      <div className="article-header">
        <h1>{article.title}</h1>
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
      
      <div className="article-actions">
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
        
        {isAuthor && (
          <div className="author-actions">
            <button 
              className="edit-btn"
              onClick={() => navigate(`/edit-article/${id}`)}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="article-content">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetail; 