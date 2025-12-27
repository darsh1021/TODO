const mongoose = require('mongoose');

const DateTaskSchema = new mongoose.Schema(
  {
    date: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const MonthlyTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    month: {
      type: String,
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      required: true,
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    dailyTasks: [
      {
        date: {
          type: Number,
          required: true,
          min: 1,
          max: 31,
        },
        tasks: [DateTaskSchema],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
MonthlyTrackerSchema.index({ userId: 1, month: 1, year: 1 });
MonthlyTrackerSchema.index({ userId: 1, year: 1 });

module.exports = mongoose.model('MonthlyTracker', MonthlyTrackerSchema);
