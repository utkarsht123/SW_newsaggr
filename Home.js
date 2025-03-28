import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleList from '../articles/ArticleList';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles');
        setArticles(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="home-page">
      <h1>Latest News</h1>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <ArticleList articles={articles} />
      )}
    </div>
  );
};

export default Home; 