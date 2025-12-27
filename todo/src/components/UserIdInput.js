import React, { useState, useEffect } from 'react';
import '../styles/UserIdInput.css';

const UserIdInput = ({ userId, onUserIdChange, onLogout }) => {
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      setInputValue(userId);
    }
  }, [userId]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onUserIdChange(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    setInputValue('');
    onLogout();
    setIsEditing(true);
  };

  return (
    <div className="userid-container">
      <div className="userid-wrapper">
        {userId && !isEditing ? (
          <div className="userid-display">
            <span className="userid-label">User ID:</span>
            <span className="userid-value">{userId}</span>
            <button
              className="edit-userid-btn"
              onClick={() => setIsEditing(true)}
              title="Change User ID"
            >
              ✏️ Change
            </button>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div className="userid-input-section">
            <label htmlFor="userid-input" className="userid-input-label">
              Enter Your User ID:
            </label>
            <div className="userid-input-wrapper">
              <input
                id="userid-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter a unique ID or code..."
                className="userid-input"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="submit-userid-btn"
              >
                Login
              </button>
            </div>
            <p className="userid-hint">
              💡 Use any unique code (email, username, number). Your data will be saved and retrieved using this ID.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIdInput;
