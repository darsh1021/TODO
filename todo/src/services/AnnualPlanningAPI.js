// API Service for Annual Planning
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class AnnualPlanningAPI {
  // Get all annual planning for user
  static async getAllPlanning(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/annual-planning`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all planning:', error);
      throw error;
    }
  }

  // Get annual planning by month
  static async getPlanningByMonth(month, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/annual-planning/${month}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching planning by month:', error);
      throw error;
    }
  }

  // Create or update annual planning
  static async createOrUpdatePlanning(month, thingsToDo, goals, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/annual-planning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({
          month,
          thingsToDo,
          goals,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating/updating planning:', error);
      throw error;
    }
  }

  // Add thing to do
  static async addThingToDo(month, text, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/annual-planning/${month}/things`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({ month, text }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding thing to do:', error);
      throw error;
    }
  }

  // Delete thing to do
  static async deleteThingToDo(month, thingId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/annual-planning/${month}/things/${thingId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting thing to do:', error);
      throw error;
    }
  }

  // Toggle thing to do completion
  static async toggleThingCompletion(month, thingId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/annual-planning/${month}/things/${thingId}/toggle`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling thing completion:', error);
      throw error;
    }
  }

  // Add goal
  static async addGoal(month, text, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/annual-planning/${month}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
        },
        body: JSON.stringify({ month, text }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }

  // Delete goal
  static async deleteGoal(month, goalId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/annual-planning/${month}/goals/${goalId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  // Toggle goal completion
  static async toggleGoalCompletion(month, goalId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/annual-planning/${month}/goals/${goalId}/toggle`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling goal completion:', error);
      throw error;
    }
  }
}

export default AnnualPlanningAPI;
