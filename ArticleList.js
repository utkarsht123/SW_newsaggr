import React from 'react';
import { Link } from 'react-router-dom';
import ArticleItem from './ArticleItem';

const ArticleList = ({ articles }) => {
  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <div className="article-list">
      {articles.map(article => (
        <ArticleItem key={article._id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList; 