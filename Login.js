import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const result = await login(formData);
    
    if (result === true) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
      <h1>Login</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
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
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      
      <p className="auth-redirect">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login; 