import React, { useState, useEffect } from 'react';
import '../styles/Revision.css';
import useLocalStorage from '../hooks/useLocalStorage';
import RevisionAPI from '../services/RevisionAPI';

const Revision = ({ userId }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthNumeric = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, monthNumeric + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, monthNumeric, 1).getDay();

  const [revisions, setRevisions] = useLocalStorage('revisions', {}, userId);
  const [topics, setTopics] = useLocalStorage('revisionTopics', [], userId);
  const [selectedDay, setSelectedDay] = useState(null);
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data from backend on component mount or userId change
  useEffect(() => {
    if (userId) {
      loadDataFromBackend();
    }
  }, [userId]);

  const loadDataFromBackend = async () => {
    try {
      setLoading(true);
      const response = await RevisionAPI.getRevisionsByMonth(currentMonth, userId, currentYear);
      if (response.success && response.data) {
        // Map tracker data to revisions state
        const revisionsMap = {};
        if (response.data.dailyTasks) {
          response.data.dailyTasks.forEach(dateEntry => {
            revisionsMap[dateEntry.date] = dateEntry.tasks.map(task => ({
              id: task.taskId._id,
              topicId: task.taskId._id,
              text: task.taskId.title,
              completed: task.completed,
            }));
          });
        }
        setRevisions(revisionsMap);
        setTopics(response.data.tasks || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading revisions:', err);
      setError('Failed to load revision data');
    } finally {
      setLoading(false);
    }
  };

  const addTopic = async () => {
    if (selectedDay && topicInput.trim()) {
      try {
        const response = await RevisionAPI.createRevisionTopic(currentMonth, topicInput, userId);
        if (response.success && response.data) {
          const topicId = response.data._id;
          
          // Add to date
          await RevisionAPI.addRevisionToDate(currentMonth, selectedDay, topicId, userId, currentYear);
          
          // Update local state
          setRevisions({
            ...revisions,
            [selectedDay]: [
              ...(revisions[selectedDay] || []),
              { id: topicId, topicId: topicId, text: topicInput, completed: false }
            ]
          });
          
          setTopics([...topics, response.data]);
          setTopicInput('');
        }
      } catch (err) {
        console.error('Error adding topic:', err);
        setError('Failed to add topic');
      }
    }
  };

  const toggleCompleted = async (day, topicId) => {
    try {
      await RevisionAPI.toggleRevisionCompletion(currentMonth, day, topicId, userId, currentYear);
      
      setRevisions({
        ...revisions,
        [day]: revisions[day].map(item =>
          item.topicId === topicId ? { ...item, completed: !item.completed } : item
        )
      });
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const deleteTopic = async (day, topicId) => {
    try {
      await RevisionAPI.removeRevisionFromDate(currentMonth, day, topicId, userId, currentYear);
      
      const updated = revisions[day].filter(item => item.topicId !== topicId);
      if (updated.length === 0) {
        const newRevisions = { ...revisions };
        delete newRevisions[day];
        setRevisions(newRevisions);
      } else {
        setRevisions({ ...revisions, [day]: updated });
      }
    } catch (err) {
      console.error('Error deleting topic:', err);
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  if (loading) {
    return <div className="revision-container"><p>Loading revision schedule...</p></div>;
  }

  return (
    <div className="revision-container">
      {error && <div className="error-message">{error}</div>}
      <h2>📚 Revision Calendar - {monthName}</h2>

      <div className="calendar-wrapper">
        <div className="calendar">
          <div className="calendar-header">
            {dayNames.map(day => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day ? 'has-date' : 'empty'} ${
                  selectedDay === day ? 'selected' : ''
                }`}
                onClick={() => day && setSelectedDay(day)}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="topics-preview">
                      {revisions[day] && revisions[day].length > 0 && (
                        <div className="topic-count">{revisions[day].length} topic(s)</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar">
          {selectedDay ? (
            <>
              <h3>📅 {monthName.split(' ')[0]} {selectedDay}</h3>

              <div className="input-section">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                  placeholder="Add topic..."
                  className="topic-input"
                />
                <button onClick={addTopic} className="add-topic-btn">
                  + Add
                </button>
              </div>

              <div className="topics-list">
                {revisions[selectedDay] && revisions[selectedDay].length > 0 ? (
                  revisions[selectedDay].map(item => (
                    <div key={item.topicId} className={`topic-item ${item.completed ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleCompleted(selectedDay, item.topicId)}
                        className="topic-checkbox"
                      />
                      <span className="topic-text">{item.text}</span>
                      <button
                        onClick={() => deleteTopic(selectedDay, item.topicId)}
                        className="delete-topic-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-topics">No topics for this day</p>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>👈 Select a date to add topics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revision;
