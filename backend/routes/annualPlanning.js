const express = require('express');
const {
  getAllAnnualPlanning,
  getAnnualPlanningByMonth,
  createOrUpdateAnnualPlanning,
  addThingToDo,
  deleteThingToDo,
  addGoal,
  deleteGoal,
  toggleThingCompletion,
  toggleGoalCompletion,
} = require('../Controllers/AnnualPlanningController');

const router = express.Router();

// Get all annual planning for user
router.get('/', getAllAnnualPlanning);

// Get annual planning by month
router.get('/:month', getAnnualPlanningByMonth);

// Create or update annual planning
router.post('/', createOrUpdateAnnualPlanning);

// Things to do routes
router.post('/:month/things', addThingToDo);
router.delete('/:month/things/:thingId', deleteThingToDo);
router.put('/:month/things/:thingId/toggle', toggleThingCompletion);

// Goals routes
router.post('/:month/goals', addGoal);
router.delete('/:month/goals/:goalId', deleteGoal);
router.put('/:month/goals/:goalId/toggle', toggleGoalCompletion);

module.exports = router;
