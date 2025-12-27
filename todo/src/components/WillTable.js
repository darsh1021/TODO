import React, { useState, useEffect } from 'react';
import '../styles/WillTable.css';
import useLocalStorage from '../hooks/useLocalStorage';
import AnnualPlanningAPI from '../services/AnnualPlanningAPI';

const WillTable = ({ userId }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [data, setData] = useLocalStorage('willTable', 
    months.map((month, index) => ({
      id: index,
      month: month,
      thingsToDo: [],
      goal: []
    })),
    userId
  );

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
      const response = await AnnualPlanningAPI.getAllPlanning(userId);
      if (response.success && response.data) {
        const updatedData = months.map(month => {
          const monthData = response.data.find(d => d.month === month);
          return {
            id: months.indexOf(month),
            month: month,
            thingsToDo: monthData?.thingsToDo || [],
            goal: monthData?.goals || []
          };
        });
        setData(updatedData);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  const addThingToDo = async (monthId) => {
    const month = data[monthId].month;
    const newThing = { id: Date.now().toString(), text: '', completed: false };
    
    setData(data.map(row =>
      row.id === monthId 
        ? { ...row, thingsToDo: [...row.thingsToDo, newThing] } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.addThingToDo(month, '', userId);
      }
    } catch (err) {
      console.error('Error adding thing:', err);
    }
  };

  const addGoal = async (monthId) => {
    const month = data[monthId].month;
    const newGoal = { id: Date.now().toString(), text: '', completed: false };
    
    setData(data.map(row =>
      row.id === monthId 
        ? { ...row, goal: [...row.goal, newGoal] } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.addGoal(month, '', userId);
      }
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const updateThingText = async (monthId, itemId, text) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { 
            ...row, 
            thingsToDo: row.thingsToDo.map(item =>
              item.id === itemId ? { ...item, text } : item
            ) 
          } 
        : row
    ));

    try {
      if (userId && text.trim()) {
        await AnnualPlanningAPI.addThingToDo(month, text, userId);
      }
    } catch (err) {
      console.error('Error updating thing:', err);
    }
  };

  const updateGoalText = async (monthId, itemId, text) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { 
            ...row, 
            goal: row.goal.map(item =>
              item.id === itemId ? { ...item, text } : item
            ) 
          } 
        : row
    ));

    try {
      if (userId && text.trim()) {
        await AnnualPlanningAPI.addGoal(month, text, userId);
      }
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const toggleThingToDo = async (monthId, itemId) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { 
            ...row, 
            thingsToDo: row.thingsToDo.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ) 
          } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.toggleThingCompletion(month, itemId, userId);
      }
    } catch (err) {
      console.error('Error toggling thing:', err);
    }
  };

  const toggleGoal = async (monthId, itemId) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { 
            ...row, 
            goal: row.goal.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ) 
          } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.toggleGoalCompletion(month, itemId, userId);
      }
    } catch (err) {
      console.error('Error toggling goal:', err);
    }
  };

  const deleteThingToDo = async (monthId, itemId) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { ...row, thingsToDo: row.thingsToDo.filter(item => item.id !== itemId) } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.deleteThingToDo(month, itemId, userId);
      }
    } catch (err) {
      console.error('Error deleting thing:', err);
    }
  };

  const deleteGoal = async (monthId, itemId) => {
    const month = data[monthId].month;
    
    setData(data.map(row =>
      row.id === monthId 
        ? { ...row, goal: row.goal.filter(item => item.id !== itemId) } 
        : row
    ));

    try {
      if (userId) {
        await AnnualPlanningAPI.deleteGoal(month, itemId, userId);
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  return (
    <div className="willtable-container">
      <div className="table-header">
        <h2>Monthly Planning</h2>
        {loading && <span className="loading-indicator">Loading...</span>}
        {error && <span className="error-indicator">⚠️ {error}</span>}
      </div>

      <table className="will-table">
        <thead>
          <tr>
            <th className="month-header">Month</th>
            <th className="things-header">Things To Do</th>
            <th className="goal-header">Goal</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td className="month-cell">
                <span className="month-name">{row.month}</span>
              </td>
              <td className="things-cell">
                <div className="list-container">
                  {row.thingsToDo.map(item => (
                    <div key={item.id} className="list-item">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleThingToDo(row.id, item.id)}
                        className="item-checkbox"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateThingText(row.id, item.id, e.target.value)}
                        placeholder="Enter task..."
                        className={`item-input ${item.completed ? 'completed' : ''}`}
                      />
                      <button
                        onClick={() => deleteThingToDo(row.id, item.id)}
                        className="delete-item-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addThingToDo(row.id)}
                    className="add-item-btn"
                  >
                    + Add
                  </button>
                </div>
              </td>
              <td className="goal-cell">
                <div className="list-container">
                  {row.goal.map(item => (
                    <div key={item.id} className="list-item">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleGoal(row.id, item.id)}
                        className="item-checkbox"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateGoalText(row.id, item.id, e.target.value)}
                        placeholder="Enter goal..."
                        className={`item-input ${item.completed ? 'completed' : ''}`}
                      />
                      <button
                        onClick={() => deleteGoal(row.id, item.id)}
                        className="delete-item-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addGoal(row.id)}
                    className="add-item-btn"
                  >
                    + Add
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WillTable;
