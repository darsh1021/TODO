
import { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import WillTable from './components/WillTable';
import Revision from './components/Revision';
import UserIdInput from './components/UserIdInput';

function App() {
  const [activeTab, setActiveTab] = useState('planning');
  const [userId, setUserId] = useState(null);

  // Load userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('todoAppUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Handle user ID login
  const handleUserIdChange = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('todoAppUserId', newUserId);
  };

  // Handle logout
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('todoAppUserId');
  };

  if (!userId) {
    return (
      <div className="App">
        <UserIdInput userId={userId} onUserIdChange={handleUserIdChange} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="App">
      <UserIdInput userId={userId} onUserIdChange={handleUserIdChange} onLogout={handleLogout} />

      <div className="app-header">
        <h1>📋 My Planning Hub</h1>
        <p>Stay organized and achieve your goals</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          📅 Annual Planning
        </button>
        <button 
          className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          📊 Monthly Tracker
        </button>
        <button 
          className={`tab-btn ${activeTab === 'revision' ? 'active' : ''}`}
          onClick={() => setActiveTab('revision')}
        >
          📚 Revision Schedule
        </button>
      </div>

      <div className="content-wrapper">
        {activeTab === 'planning' && <WillTable userId={userId} />}
        {activeTab === 'monthly' && <Table userId={userId} />}
        {activeTab === 'revision' && <Revision userId={userId} />}
      </div>
    </div>
  );
}

export default App;
