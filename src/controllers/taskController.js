const Task = require('../models/Task');

const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

const getAllTasks = async (req, res) => {
  try {
    const { completed, priority, tag } = req.query;
    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority !== undefined) {
      if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
      }
      filter.priority = { $eq: priority };
    }
    if (tag !== undefined) filter.tags = { $eq: String(tag).trim() };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, completed, priority, tags } = req.body;
    const doc = {};
    if (title !== undefined) doc.title = String(title);
    if (description !== undefined) doc.description = String(description);
    if (completed !== undefined) doc.completed = Boolean(completed);
    if (priority !== undefined) {
      if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
      }
      doc.priority = priority;
    }
    if (tags !== undefined) doc.tags = [].concat(tags).map(String);

    const task = await Task.create(doc);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, completed, priority, tags } = req.body;
    const update = {};
    if (title !== undefined) update.title = String(title);
    if (description !== undefined) update.description = String(description);
    if (completed !== undefined) update.completed = Boolean(completed);
    if (priority !== undefined) {
      if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
      }
      update.priority = priority;
    }
    if (tags !== undefined) update.tags = [].concat(tags).map(String);

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
