const mongoose = require('mongoose');

const AnnualPlanningSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      required: [true, 'Please provide a month'],
    },
    thingsToDo: [
      {
        id: {
          type: String,
          default: () => Date.now().toString(),
        },
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    goals: [
      {
        id: {
          type: String,
          default: () => Date.now().toString(),
        },
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AnnualPlanning', AnnualPlanningSchema);
