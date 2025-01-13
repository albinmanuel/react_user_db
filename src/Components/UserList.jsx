import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUser, deleteUser } from '../dbConfig';

function UserList({ setEditingUser }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getAllUsers();
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleBlockUnblock = async (user) => {
    const updatedUser = { ...user, isBlocked: !user.isBlocked };
    await updateUser(updatedUser);
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
    );
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    navigate('/register');
  };

  return (
    <div className="user-list">
      <h2>User Management</h2>
      <div className="user-list-container">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span>{user.username}</span>
              <br />
              <small>{user.email}</small>
            </div>
            <div className="button-group">
              <button className="edit-button" onClick={() => handleEdit(user)}>
                Edit
              </button>
              <button
                className={user.isBlocked ? 'unblock-button' : 'block-button'}
                onClick={() => handleBlockUnblock(user)}
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
              <button className="delete-button" onClick={() => handleDelete(user.id)}>
                Delete
              </button>
            </div>
            <div className="login-history">
              <h4>Login History</h4>
              <ul>
                {user.loginHistory.map((loginTime, index) => (
                  <li key={index}>{loginTime}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;