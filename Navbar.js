import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const authLinks = (
    <ul className="navbar-nav">
      {user && user.role === 'publisher' && (
        <li className="nav-item">
          <Link to="/create-article">Create Article</Link>
        </li>
      )}
      <li className="nav-item">
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li className="nav-item">
        <a href="#!" onClick={handleLogout}>Logout</a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login">Login</Link>
      </li>
      <li className="nav-item">
        <Link to="/register">Register</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">NewsAggregator</Link>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar; 