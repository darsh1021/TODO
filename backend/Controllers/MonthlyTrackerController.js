const Task = require('../Models/Task');
const MonthlyTracker = require('../Models/MonthlyTracker');

// Get all tasks for a specific month
exports.getTasksByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user?.id || req.userId;
    const year = req.query.year || new Date().getFullYear();

    const tasks = await Task.find({ userId, month })
      .sort({ createdAt: -1 });

    const tracker = await MonthlyTracker.findOne({ userId, month, year })
      .populate('dailyTasks.tasks.taskId');

    res.status(200).json({
      success: true,
      data: {
        tasks,
        tracker,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new task for a month
exports.createTask = async (req, res) => {
  try {
    const { month, title, description, priority, category } = req.body;
    const userId = req.user?.id || req.userId;

    if (!month || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and title',
      });
    }

    const task = await Task.create({
      userId,
      month,
      title,
      description: description || '',
      priority: priority || 'medium',
      category: category || 'General',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task details
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, category } = req.body;
    const userId = req.user?.id || req.userId;

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (category) task.category = category;

    task.updatedAt = new Date();
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id || req.userId;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Remove task from all monthly trackers
    await MonthlyTracker.updateMany(
      { userId },
      {
        $pull: {
          'dailyTasks.$[].tasks': { taskId: taskId },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add task to a specific date in monthly tracker
exports.addTaskToDate = async (req, res) => {
  try {
    const { month, date, taskId } = req.body;
    const userId = req.user?.id || req.userId;
    const year = req.body.year || new Date().getFullYear();

    if (!month || !date || !taskId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month, date, and taskId',
      });
    }

    // Verify task exists
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    let tracker = await MonthlyTracker.findOne({ userId, month, year });

    if (!tracker) {
      tracker = await MonthlyTracker.create({
        userId,
        month,
        year,
        dailyTasks: [
          {
            date,
            tasks: [{ taskId, completed: false }],
          },
        ],
      });
    } else {
      const dateEntry = tracker.dailyTasks.find(d => d.date === date);

      if (dateEntry) {
        // Check if task already exists on this date
        const taskExists = dateEntry.tasks.some(t => t.taskId.toString() === taskId);
        if (!taskExists) {
          dateEntry.tasks.push({ taskId, completed: false });
        }
      } else {
        tracker.dailyTasks.push({
          date,
          tasks: [{ taskId, completed: false }],
        });
      }

      tracker.updatedAt = new Date();
      await tracker.save();
    }

    res.status(201).json({
      success: true,
      message: 'Task added to date successfully',
      data: tracker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle task completion status for a specific date
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { month, date, taskId } = req.body;
    const userId = req.user?.id || req.userId;
    const year = req.body.year || new Date().getFullYear();

    if (!month || date === undefined || !taskId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month, date, and taskId',
      });
    }

    const tracker = await MonthlyTracker.findOne({ userId, month, year });

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: 'Monthly tracker not found',
      });
    }

    const dateEntry = tracker.dailyTasks.find(d => d.date === date);

    if (!dateEntry) {
      return res.status(404).json({
        success: false,
        message: 'Date entry not found',
      });
    }

    const taskEntry = dateEntry.tasks.find(t => t.taskId.toString() === taskId);

    if (!taskEntry) {
      return res.status(404).json({
        success: false,
        message: 'Task not found for this date',
      });
    }

    taskEntry.completed = !taskEntry.completed;
    tracker.updatedAt = new Date();
    await tracker.save();

    res.status(200).json({
      success: true,
      message: 'Task completion toggled successfully',
      data: tracker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove task from a specific date
exports.removeTaskFromDate = async (req, res) => {
  try {
    const { month, date, taskId } = req.body;
    const userId = req.user?.id || req.userId;
    const year = req.body.year || new Date().getFullYear();

    if (!month || date === undefined || !taskId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month, date, and taskId',
      });
    }

    const tracker = await MonthlyTracker.findOne({ userId, month, year });

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: 'Monthly tracker not found',
      });
    }

    const dateEntry = tracker.dailyTasks.find(d => d.date === date);

    if (!dateEntry) {
      return res.status(404).json({
        success: false,
        message: 'Date entry not found',
      });
    }

    dateEntry.tasks = dateEntry.tasks.filter(t => t.taskId.toString() !== taskId);

    // Remove empty date entries
    tracker.dailyTasks = tracker.dailyTasks.filter(d => d.tasks.length > 0);

    tracker.updatedAt = new Date();
    await tracker.save();

    res.status(200).json({
      success: true,
      message: 'Task removed from date successfully',
      data: tracker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get monthly tracker for a specific month
exports.getMonthlyTracker = async (req, res) => {
  try {
    const { month } = req.params;
    const userId = req.user?.id || req.userId;
    const year = req.query.year || new Date().getFullYear();

    const tracker = await MonthlyTracker.findOne({ userId, month, year })
      .populate('dailyTasks.tasks.taskId');

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: 'Monthly tracker not found',
      });
    }

    res.status(200).json({
      success: true,
      data: tracker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
