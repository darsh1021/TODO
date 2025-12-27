const AnnualPlanning = require('../Models/AnnualPlanning');

// Get all annual planning for a user
exports.getAllAnnualPlanning = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const annualPlannings = await AnnualPlanning.find({ userId }).sort({ month: 1 });
    
    res.status(200).json({
      success: true,
      data: annualPlannings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get annual planning by month
exports.getAnnualPlanningByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user?.id || req.userId;
    
    const planning = await AnnualPlanning.findOne({ month, userId });
    
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Annual planning not found for this month',
      });
    }
    
    res.status(200).json({
      success: true,
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create or update annual planning
exports.createOrUpdateAnnualPlanning = async (req, res) => {
  try {
    const { month, thingsToDo, goals } = req.body;
    const userId = req.user?.id || req.userId;
    
    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a month',
      });
    }
    
    let planning = await AnnualPlanning.findOne({ month, userId });
    
    if (planning) {
      planning.thingsToDo = thingsToDo || planning.thingsToDo;
      planning.goals = goals || planning.goals;
      planning.updatedAt = new Date();
      await planning.save();
    } else {
      planning = await AnnualPlanning.create({
        month,
        thingsToDo: thingsToDo || [],
        goals: goals || [],
        userId,
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Annual planning saved successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add thing to do
exports.addThingToDo = async (req, res) => {
  try {
    const { month, text } = req.body;
    const userId = req.user?.id || req.userId;
    
    if (!month || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and text',
      });
    }
    
    let planning = await AnnualPlanning.findOne({ month, userId });
    
    // Create month record if it doesn't exist
    if (!planning) {
      planning = await AnnualPlanning.create({
        month,
        userId,
        thingsToDo: [],
        goals: [],
      });
    }
    
    const newThing = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    
    planning.thingsToDo.push(newThing);
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(201).json({
      success: true,
      message: 'Thing to do added successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete thing to do
exports.deleteThingToDo = async (req, res) => {
  try {
    const { month, thingId } = req.params;
    const userId = req.user?.id || req.userId;
    
    const planning = await AnnualPlanning.findOne({ month, userId });
    
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Annual planning not found for this month',
      });
    }
    
    planning.thingsToDo = planning.thingsToDo.filter(thing => thing.id !== thingId);
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(200).json({
      success: true,
      message: 'Thing to do deleted successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add goal
exports.addGoal = async (req, res) => {
  try {
    const { month, text } = req.body;
    const userId = req.user?.id || req.userId;
    
    if (!month || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and text',
      });
    }
    
    let planning = await AnnualPlanning.findOne({ month, userId });
    
    // Create month record if it doesn't exist
    if (!planning) {
      planning = await AnnualPlanning.create({
        month,
        userId,
        thingsToDo: [],
        goals: [],
      });
    }
    
    const newGoal = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    
    planning.goals.push(newGoal);
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(201).json({
      success: true,
      message: 'Goal added successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const { month, goalId } = req.params;
    const userId = req.user?.id || req.userId;
    
    const planning = await AnnualPlanning.findOne({ month, userId });
    
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Annual planning not found for this month',
      });
    }
    
    planning.goals = planning.goals.filter(goal => goal.id !== goalId);
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle thing to do completion
exports.toggleThingCompletion = async (req, res) => {
  try {
    const { month, thingId } = req.params;
    const userId = req.user?.id || req.userId;
    
    const planning = await AnnualPlanning.findOne({ month, userId });
    
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Annual planning not found for this month',
      });
    }
    
    const thing = planning.thingsToDo.find(t => t.id === thingId);
    if (thing) {
      thing.completed = !thing.completed;
    }
    
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(200).json({
      success: true,
      message: 'Thing to do updated successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle goal completion
exports.toggleGoalCompletion = async (req, res) => {
  try {
    const { month, goalId } = req.params;
    const userId = req.user?.id || req.userId;
    
    const planning = await AnnualPlanning.findOne({ month, userId });
    
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Annual planning not found for this month',
      });
    }
    
    const goal = planning.goals.find(g => g.id === goalId);
    if (goal) {
      goal.completed = !goal.completed;
    }
    
    planning.updatedAt = new Date();
    await planning.save();
    
    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: planning,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
