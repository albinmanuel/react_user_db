import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser, updateUser } from '../dbConfig';

function Register({ editingUser, setEditingUser }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (editingUser) {
      setUserDetails({
        username: editingUser.username,
        email: editingUser.email,
        password: editingUser.password
      });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updatedUser = {
          ...editingUser,
          username: userDetails.username,
          email: userDetails.email,
          password: userDetails.password
        };
        await updateUser(updatedUser);
        alert('User updated successfully!');
        setEditingUser(null);
        navigate('/dashboard');
      } else {
        await addUser({ ...userDetails, isBlocked: false, loginHistory: [] });
        alert('User registered successfully!');
        navigate('/login');
      }
      setUserDetails({ username: '', email: '', password: '' });
    } catch (error) {
      alert('Error registering/updating user.');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setUserDetails({ username: '', email: '', password: '' });
    navigate('/dashboard');
  }

  return (
    <div className="auth-container">
      <h2>{editingUser ? 'Edit User' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="username"
            placeholder="Username"
            value={userDetails.username}
            onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">{editingUser ? 'Update User' : 'Create Account'}</button>
        {editingUser && (
          <button type="button" onClick={handleCancel} style={{ marginTop: '10px', backgroundColor: '#95a5a6' }}>
            Cancel
          </button>
        )}
      </form>
      {!editingUser && (
        <p className="link-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      )}
    </div>
  );
}

export default Register;