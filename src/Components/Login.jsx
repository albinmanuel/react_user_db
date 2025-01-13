import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByEmail, updateUser } from '../dbConfig';

function Login({ setAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await getUserByEmail(userDetails.email);
      
      if (user && user.password === userDetails.password) {
        // Check if user is blocked
        if (user.isBlocked) {
          setError('Your account has been blocked. Please contact administrator.');
          return;
        }

        const currentTime = new Date().toLocaleString();
        const updatedUser = {
          ...user,
          loginHistory: [...user.loginHistory, currentTime],
        };

        await updateUser(updatedUser);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setAuthenticated(true);
        setUser(updatedUser);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('User not found');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="link-text">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;