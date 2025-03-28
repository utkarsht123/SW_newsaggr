import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'reader'
  });

  const [error, setError] = useState('');

  const { username, email, password, password2, role } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await register({
      username,
      email,
      password,
      role
    });
    
    if (result === true) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-form">
      <h1>Register</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={onChange}
          >
            <option value="reader">Reader</option>
            <option value="publisher">Publisher</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      
      <p className="auth-redirect">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register; 