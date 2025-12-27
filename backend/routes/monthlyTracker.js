const express = require('express');
const router = express.Router();
const MonthlyTrackerController = require('../Controllers/MonthlyTrackerController');

// Tasks Routes
// GET all tasks for a month
router.get('/tasks/:month', MonthlyTrackerController.getTasksByMonth);

// POST create a new task
router.post('/tasks', MonthlyTrackerController.createTask);

// PUT update a task
router.put('/tasks/:taskId', MonthlyTrackerController.updateTask);

// DELETE delete a task
router.delete('/tasks/:taskId', MonthlyTrackerController.deleteTask);

// Monthly Tracker Routes
// GET monthly tracker for a specific month
router.get('/:month', MonthlyTrackerController.getMonthlyTracker);

// POST add task to a specific date
router.post('/date/add', MonthlyTrackerController.addTaskToDate);

// PUT toggle task completion status for a date
router.put('/date/toggle', MonthlyTrackerController.toggleTaskCompletion);

// DELETE remove task from a specific date
router.delete('/date/remove', MonthlyTrackerController.removeTaskFromDate);

module.exports = router;
