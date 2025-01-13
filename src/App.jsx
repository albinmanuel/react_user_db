import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import UserList from './Components/UserList';
import '../src/index.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <div>
      <h1>React User Management</h1>
      {authenticated && (
        <button onClick={handleLogout} style={{ float: 'right',width:'5%' ,marginRight:'10px'}}>
          Logout
        </button>
      )}
      <Routes>
        <Route 
          path="/login" 
          element={
            !authenticated ? (
              <Login setAuthenticated={setAuthenticated} setUser={setUser} />
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            <Register editingUser={editingUser} setEditingUser={setEditingUser} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            authenticated ? (
              <>
                <h2>Welcome, {user.username}</h2>
                <UserList setEditingUser={setEditingUser} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;