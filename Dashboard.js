import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ArticleList from '../articles/ArticleList';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [userArticles, setUserArticles] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [stats, setStats] = useState({
    articleCount: 0,
    totalUpvotes: 0,
    mostUpvoted: null
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's articles if they're a publisher
        if (user.role === 'publisher' || user.role === 'admin') {
          const articlesRes = await axios.get('/api/articles/user');
          setUserArticles(articlesRes.data);
          
          // Calculate stats
          const articleCount = articlesRes.data.length;
          const totalUpvotes = articlesRes.data.reduce((sum, article) => sum + article.upvotes, 0);
          const mostUpvoted = articlesRes.data.reduce(
            (max, article) => (!max || article.upvotes > max.upvotes) ? article : max, 
            null
          );
          
          setStats({
            articleCount,
            totalUpvotes,
            mostUpvoted
          });
        }
        
        // Fetch user's votes
        const votesRes = await axios.get('/api/votes/user');
        setUserVotes(votesRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (loading) {
    return <p>Loading dashboard...</p>;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {(user.role === 'publisher' || user.role === 'admin') && (
          <Link to="/create-article" className="btn btn-primary">
            Create New Article
          </Link>
        )}
      </div>
      
      {(user.role === 'publisher' || user.role === 'admin') && (
        <>
          <h2>Your Publishing Stats</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.articleCount}</div>
              <div className="stat-label">Articles Published</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalUpvotes}</div>
              <div className="stat-label">Total Upvotes</div>
            </div>
            {stats.mostUpvoted && (
              <div className="stat-card">
                <div className="stat-value">{stats.mostUpvoted.upvotes}</div>
                <div className="stat-label">
                  Most Upvoted: 
                  <Link to={`/articles/${stats.mostUpvoted._id}`}>
                    {stats.mostUpvoted.title}
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <h2>Your Articles</h2>
          {userArticles.length > 0 ? (
            <ArticleList articles={userArticles} />
          ) : (
            <p>You haven't published any articles yet.</p>
          )}
        </>
      )}
      
      <h2>Articles You've Upvoted</h2>
      {userVotes.length > 0 ? (
        <ArticleList articles={userVotes.map(vote => vote.article)} />
      ) : (
        <p>You haven't upvoted any articles yet.</p>
      )}
    </div>
  );
};

export default Dashboard; 