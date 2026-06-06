const { z } = require('zod');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const { mockDb } = require('../utils/mockDb');

// Zod schema for creating tasks
const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().datetime({ message: 'Invalid ISO date string' }).or(z.string().date({ message: 'Invalid date format' })).optional().nullable()
});

// Zod schema for updating tasks
const updateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime({ message: 'Invalid ISO date string' }).or(z.string().date({ message: 'Invalid date format' })).optional().nullable()
});

/**
 * @desc Get all tasks for the logged-in user with filtering
 * @route GET /api/tasks
 * @access Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, startDate, endDate } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    // Construct query with owner constraint
    const query = { userId: req.userId };

    // Advanced Filtering
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Date Range Filtering (based on due date)
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) {
        query.dueDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.dueDate.$lte = new Date(endDate);
      }
    }

    let tasks;
    if (isDbConnected) {
      // Execute query sorted by creation time (newest first)
      tasks = await Task.find(query).sort({ createdAt: -1 });
    } else {
      // Fallback to offline mock memory
      tasks = await mockDb.tasks.find(query);
      // Sort newest first
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      data: tasks,
      code: 'FETCH_TASKS_SUCCESS'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new task
 * @route POST /api/tasks
 * @access Private
 */
const createTask = async (req, res, next) => {
  try {
    const validationResult = createTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(issue => issue.message).join(', ');
      throw new AppError(errorMsg, 400, 'VALIDATION_ERROR');
    }

    const { title, description, priority, dueDate } = validationResult.data;
    const isDbConnected = mongoose.connection.readyState === 1;

    let task;
    if (isDbConnected) {
      // Create task referencing authenticated user
      task = await Task.create({
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        userId: req.userId
      });
    } else {
      // Fallback to offline mock memory
      task = await mockDb.tasks.create({
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        userId: req.userId
      });
    }

    logger.info(`Task created successfully (${isDbConnected ? 'DB' : 'Offline Mock'}): ${task._id} by user: ${req.userId}`);

    res.status(201).json({
      success: true,
      data: task,
      code: 'TASK_CREATED'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a task
 * @route PUT /api/tasks/:id
 * @access Private
 */
const updateTask = async (req, res, next) => {
  try {
    const validationResult = updateTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map(issue => issue.message).join(', ');
      throw new AppError(errorMsg, 400, 'VALIDATION_ERROR');
    }

    const taskId = req.params.id;
    const isDbConnected = mongoose.connection.readyState === 1;
    const db = isDbConnected ? Task : mockDb.tasks;

    const task = await db.findById(taskId);

    if (!task) {
      throw new AppError(`Task not found with id ${taskId}`, 404, 'TASK_NOT_FOUND');
    }

    // Authorization check: Verify ownership
    if (task.userId.toString() !== req.userId) {
      throw new AppError('Not authorized to access this task', 403, 'FORBIDDEN');
    }

    // Apply updates
    const updateData = validationResult.data;
    if (updateData.dueDate !== undefined) {
      updateData.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    let updatedTask;
    if (isDbConnected) {
      updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      updatedTask = await mockDb.tasks.findByIdAndUpdate(taskId, updateData);
    }

    logger.info(`Task updated (${isDbConnected ? 'DB' : 'Offline Mock'}): ${taskId} by user: ${req.userId}`);

    res.status(200).json({
      success: true,
      data: updatedTask,
      code: 'TASK_UPDATED'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const isDbConnected = mongoose.connection.readyState === 1;
    const db = isDbConnected ? Task : mockDb.tasks;

    const task = await db.findById(taskId);

    if (!task) {
      throw new AppError(`Task not found with id ${taskId}`, 404, 'TASK_NOT_FOUND');
    }

    // Authorization check: Verify ownership
    if (task.userId.toString() !== req.userId) {
      throw new AppError('Not authorized to delete this task', 403, 'FORBIDDEN');
    }

    if (isDbConnected) {
      await Task.findByIdAndDelete(taskId);
    } else {
      await mockDb.tasks.findByIdAndDelete(taskId);
    }

    logger.info(`Task deleted (${isDbConnected ? 'DB' : 'Offline Mock'}): ${taskId} by user: ${req.userId}`);

    res.status(200).json({
      success: true,
      data: null,
      code: 'TASK_DELETED'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
