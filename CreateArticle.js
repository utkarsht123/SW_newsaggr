import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const CreateArticle = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: ''
  });
  
  const [error, setError] = useState('');
  
  const { title, summary, content, tags } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create an article');
      return;
    }
    
    if (user.role !== 'publisher' && user.role !== 'admin') {
      setError('Only publishers can create articles');
      return;
    }
    
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const articleData = {
        title,
        summary,
        content,
        tags: tagsArray
      };
      
      const res = await axios.post('/api/articles', articleData);
      navigate(`/articles/${res.data._id}`);
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err.response?.data?.message || 'Error creating article');
    }
  };
  
  return (
    <div className="create-article">
      <h1>Create New Article</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={summary}
            onChange={onChange}
            required
            rows="2"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            required
            rows="10"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tags}
            onChange={onChange}
            placeholder="news, technology, sports, etc."
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Publish Article</button>
      </form>
    </div>
  );
};

export default CreateArticle; 