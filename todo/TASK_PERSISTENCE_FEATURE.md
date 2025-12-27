# Task Persistence Feature

## Overview
Tasks created in the Monthly Tracker are saved to the Task model database and can be reused across different months. When you delete a task from a month, it stays in the Task model and can be used in future months.

---

## How It Works

### Adding a New Task

**When you:**
1. Click "+ Add Row" in Monthly Tracker
2. Type a task name and press Enter/blur

**What happens:**
- ✅ Task is created in **Task Model** (persistent database)
- ✅ Task is assigned to the current month in **MonthlyTracker**
- ✅ Task ID is stored for future reuse
- ✅ Both databases are synced automatically

**Example:**
```
January 15: "Complete Project"
         ↓
Task Model: { _id: "abc123", title: "Complete Project", month: "January" }
MonthlyTracker: { month: "January", date: 15, taskId: "abc123" }
```

---

### Deleting a Task from Month

**When you:**
1. Click "Delete" button on a task row

**What happens:**
- ✅ Task is **removed from current month only** (MonthlyTracker)
- ✅ Task **stays in Task Model** (not deleted)
- ✅ Task becomes available for other months
- ✅ You can add it back to same month or use in future months

**Example:**
```
Before Delete:
  January MonthlyTracker: { date: 15, taskId: "abc123" }
  Task Model: { _id: "abc123", title: "Complete Project" }

After Delete:
  January MonthlyTracker: (removed)
  Task Model: { _id: "abc123", title: "Complete Project" } ← STILL HERE!

Next Month (March):
  You can add "Complete Project" to March without recreating it!
```

---

## Reusing Tasks Across Months

### Scenario: Weekly Standup Meeting

**January Setup:**
```
1. Create "Standup Meeting" on Jan 8
   → Saved to Task Model
   → Assigned to Jan 8 in MonthlyTracker

2. Assign to Jan 15, 22, 29
   → Same task ID reused
   → Multiple dates, one task
```

**March Reuse:**
```
3. Add same "Standup Meeting" to Mar 7, 14, 21, 28
   → Uses existing task ID from Task Model
   → No duplicate data
```

**Result:**
```
Task Model: 1 entry ("Standup Meeting")
MonthlyTracker January: 4 assignments
MonthlyTracker March: 4 assignments
Total: 9 entries pointing to 1 task!
```

---

## Database Structure

### Task Model
```javascript
{
  _id: ObjectId,
  userId: "user123",
  month: "January",
  title: "Complete Project",
  description: "...",
  priority: "high",
  category: "Work",
  createdAt: ISODate,
  updatedAt: ISODate
}
```
**Purpose:** Store task definitions permanently

### MonthlyTracker Model
```javascript
{
  _id: ObjectId,
  userId: "user123",
  month: "January",
  year: 2025,
  dailyTasks: [
    {
      date: 15,
      tasks: [
        {
          taskId: ObjectId,  // References Task._id
          completed: false
        }
      ]
    }
  ]
}
```
**Purpose:** Store month-specific task assignments

---

## API Methods Used

### For Adding Tasks
```javascript
MonthlyTrackerAPI.createTask(month, title, description, priority, category, userId)
// Creates entry in Task Model
// Assigns to current month in MonthlyTracker
```

### For Removing from Month (Keep Task)
```javascript
MonthlyTrackerAPI.removeTaskFromDate(month, date, taskId, userId, year)
// Removes from MonthlyTracker only
// Task Model stays intact
```

### For Assigning to New Dates/Months
```javascript
MonthlyTrackerAPI.addTaskToDate(month, date, taskId, userId, year)
// Uses existing taskId from Task Model
// Creates new assignment in MonthlyTracker
```

---

## Current Implementation

### Table Component
- ✅ When adding task: Saves to both Task Model and MonthlyTracker
- ✅ When deleting row: Removes from MonthlyTracker only (keeps Task Model)
- ✅ Automatically removes from all dates in current month

### Revision Component
- ✅ When adding topic: Saves to Task Model with category "Revision"
- ✅ When deleting topic: Removes from date only (keeps Task Model)
- ✅ Topics can be reused across multiple dates and months

---

## Benefits

1. **No Data Duplication**
   - Same task used multiple times = one database entry

2. **Flexible Task Management**
   - Remove task from one month without affecting others
   - Reuse recurring tasks easily

3. **Space Efficient**
   - Smaller database size
   - Better performance with large task lists

4. **User Friendly**
   - Delete feels safe (not permanent)
   - Easy to manage recurring tasks

5. **Offline Support**
   - localStorage maintains both collections
   - Sync when online

---

## Testing the Feature

1. **Create a task** in January: "Weekly Review"
2. **Assign to Jan 10, 20, 30** (same task, multiple dates)
3. **Delete row in January** (removes from all dates)
4. **Go to February**
5. **Add "Weekly Review" to Feb 15**
   - (Should still be available in Task Model)
6. **Check database:**
   - Task Model: 1 entry
   - MonthlyTracker Jan: empty
   - MonthlyTracker Feb: 1 entry

**Result:** Task persisted across months! ✅

---

## File Changes

**Modified:**
- `src/components/Table.js` - deleteRow() now removes from month only

**Already Correct:**
- `src/components/Revision.js` - Already uses removeRevisionFromDate()
- `src/services/MonthlyTrackerAPI.js` - Has removeTaskFromDate()
- `src/services/RevisionAPI.js` - Has removeRevisionFromDate()
- `backend/Controllers/MonthlyTrackerController.js` - Has removeTaskFromDate endpoint

---

## Key Points

✅ **Add Task** → Saved to Task Model (persistent)
✅ **Delete Row** → Removed from MonthlyTracker (month-specific)
✅ **Task Stays** → Available in Task Model for future months
✅ **Reuse** → Same task can be assigned to multiple months
✅ **Offline** → Both collections synced via localStorage

---

## Future Enhancements (Optional)

- [ ] Copy task from previous month
- [ ] Task templates library
- [ ] Bulk assign task to multiple months
- [ ] Archive vs delete distinction
- [ ] Task analytics (usage across months)
