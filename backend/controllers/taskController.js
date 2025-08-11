const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTask = async (req, res) => {
  const { title, description, deadline } = req.body; // destructure first
  try {
    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined // date conversion
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { title, description, completed, deadline } = req.body;
  try {
    const { id } = req.params;
    if (!require('mongoose').isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (String(task.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed ?? task.completed;
    task.deadline = deadline || task.deadline;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (String(task.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
