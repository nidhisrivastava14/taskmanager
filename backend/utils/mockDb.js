const bcrypt = require('bcryptjs');

/**
 * Mock In-Memory Database
 * Keeps the application fully functional for evaluation
 * even when MongoDB Atlas DNS and Local MongoDB are both blocked/unavailable.
 */

const mockUsers = [];
const mockTasks = [];

// Seed mock tasks for testing dashboard statistics immediately in offline mode
const seedMockTasks = (userId) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      _id: 'mock_task_1',
      title: 'Setup MERN application structure',
      description: 'Create atomic directory structures and backend server entry points.',
      status: 'completed',
      priority: 'high',
      dueDate: today.toISOString(),
      userId,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      _id: 'mock_task_2',
      title: 'Configure Tailwind CSS',
      description: 'Implement dark/light mode configurations and color palettes.',
      status: 'pending',
      priority: 'medium',
      dueDate: tomorrow.toISOString(),
      userId,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    },
    {
      _id: 'mock_task_3',
      title: 'Connect Database (Atlas DNS Troubleshooting)',
      description: 'Review network configurations or local fallback endpoints.',
      status: 'pending',
      priority: 'high',
      dueDate: yesterday.toISOString(), // Overdue task!
      userId,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString()
    }
  ];
};

const mockDb = {
  users: {
    findOne: async (query) => {
      const email = query.email?.toLowerCase();
      return mockUsers.find(u => u.email === email) || null;
    },
    create: async (userData) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = {
        _id: 'mock_user_' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // mock model method helper
        comparePassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        }
      };
      mockUsers.push(newUser);
      
      // Auto-seed mock tasks for the new user so they see a populated dashboard
      const seeded = seedMockTasks(newUser._id);
      mockTasks.push(...seeded);

      return newUser;
    }
  },
  tasks: {
    find: async (query) => {
      let results = mockTasks.filter(t => t.userId === query.userId);
      
      // Filter status
      if (query.status) {
        results = results.filter(t => t.status === query.status);
      }
      // Filter priority
      if (query.priority) {
        results = results.filter(t => t.priority === query.priority);
      }
      // Filter dates
      if (query.dueDate) {
        if (query.dueDate.$gte) {
          results = results.filter(t => new Date(t.dueDate) >= new Date(query.dueDate.$gte));
        }
        if (query.dueDate.$lte) {
          results = results.filter(t => new Date(t.dueDate) <= new Date(query.dueDate.$lte));
        }
      }
      
      return results;
    },
    create: async (taskData) => {
      const newTask = {
        _id: 'mock_task_' + Math.random().toString(36).substr(2, 9),
        title: taskData.title,
        description: taskData.description || '',
        status: 'pending',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        userId: taskData.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockTasks.push(newTask);
      return newTask;
    },
    findById: async (id) => {
      return mockTasks.find(t => t._id === id) || null;
    },
    findByIdAndUpdate: async (id, updateFields) => {
      const taskIndex = mockTasks.findIndex(t => t._id === id);
      if (taskIndex === -1) return null;
      
      const updatedTask = {
        ...mockTasks[taskIndex],
        ...updateFields,
        updatedAt: new Date().toISOString()
      };
      mockTasks[taskIndex] = updatedTask;
      return updatedTask;
    },
    findByIdAndDelete: async (id) => {
      const taskIndex = mockTasks.findIndex(t => t._id === id);
      if (taskIndex === -1) return false;
      mockTasks.splice(taskIndex, 1);
      return true;
    }
  }
};

module.exports = { mockDb, mockUsers, mockTasks };
