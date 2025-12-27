// API Service for Revision Schedule
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class RevisionAPI {
  // Note: We'll use the MonthlyTracker API for revision topics
  // This is an alias/wrapper to make it clear we're dealing with revision data

  // Get revision topics for a month
  static async getRevisionsByMonth(month, userId, year = new Date().getFullYear()) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/${month}?year=${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching revisions by month:', error);
      throw error;
    }
  }

  // Create a new revision topic (task)
  static async createRevisionTopic(month, title, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          month,
          title,
          description: 'Revision topic',
          priority: 'high',
          category: 'Revision',
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating revision topic:', error);
      throw error;
    }
  }

  // Update revision topic
  static async updateRevisionTopic(topicId, title, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/tasks/${topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          title,
          description: 'Revision topic',
          priority: 'high',
          category: 'Revision',
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating revision topic:', error);
      throw error;
    }
  }

  // Delete revision topic
  static async deleteRevisionTopic(topicId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/tasks/${topicId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting revision topic:', error);
      throw error;
    }
  }

  // Add revision topic to a specific date
  static async addRevisionToDate(month, date, topicId, userId, year = new Date().getFullYear()) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/date/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          month,
          date,
          taskId: topicId,
          year,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding revision to date:', error);
      throw error;
    }
  }

  // Toggle revision completion status for a date
  static async toggleRevisionCompletion(month, date, topicId, userId, year = new Date().getFullYear()) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/date/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          month,
          date,
          taskId: topicId,
          year,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling revision completion:', error);
      throw error;
    }
  }

  // Remove revision from a specific date
  static async removeRevisionFromDate(month, date, topicId, userId, year = new Date().getFullYear()) {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-tracker/date/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          month,
          date,
          taskId: topicId,
          year,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing revision from date:', error);
      throw error;
    }
  }
}

export default RevisionAPI;
