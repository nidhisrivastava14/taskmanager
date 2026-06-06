import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { taskService } from '../services/api';
import DashboardLayout from '../components/organisms/DashboardLayout';
import StatCard from '../components/molecules/StatCard';
import TaskList from '../components/organisms/TaskList';
import TaskForm from '../components/molecules/TaskForm';
import Spinner from '../components/atoms/Spinner';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

/**
 * Dashboard Page Component
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Fetch all tasks for user
  const fetchTasks = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      // Build clean query params (excluding empty values)
      const params = {};
      if (activeFilters.status) params.status = activeFilters.status;
      if (activeFilters.priority) params.priority = activeFilters.priority;
      if (activeFilters.startDate) params.startDate = activeFilters.startDate;
      if (activeFilters.endDate) params.endDate = activeFilters.endDate;

      const response = await taskService.getTasks(params);
      setTasks(response.data || []);
    } catch (error) {
      addToast('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Refetch when status/priority/date filters change
  useEffect(() => {
    fetchTasks(filters);
  }, [filters.status, filters.priority, filters.startDate, filters.endDate, fetchTasks]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Reset filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  // Toggle status completed <-> pending
  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      
      // Update locally first for optimistic UI response
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );

      await taskService.updateTask(task._id, { status: nextStatus });
      addToast(`Task marked as ${nextStatus}`, 'success');
      
      // Fetch fresh dashboard data to update statistics correctly
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const response = await taskService.getTasks(params);
      setTasks(response.data || []);
    } catch (error) {
      addToast('Failed to update task status', 'error');
      // Rollback changes
      fetchTasks(filters);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!isConfirmed) return;

    try {
      await taskService.deleteTask(id);
      addToast('Task deleted successfully', 'success');
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
    } catch (error) {
      addToast('Failed to delete task', 'error');
    }
  };

  // Handle save task (create or update)
  const handleSaveTask = async (taskData) => {
    setActionLoading(true);
    try {
      if (editingTask) {
        // Update logic
        const response = await taskService.updateTask(editingTask._id, taskData);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === editingTask._id ? response.data : t))
        );
        addToast('Task updated successfully', 'success');
      } else {
        // Create logic
        const response = await taskService.createTask(taskData);
        setTasks((prevTasks) => [response.data, ...prevTasks]);
        addToast('Task created successfully', 'success');
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to save task';
      addToast(errorMsg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Calculate statistics (always based on the total list, before page filters if possible, but standard is calculations on current loaded user tasks)
  const statistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < today).length;

    return {
      total,
      completedPercent: `${percent}%`,
      overdue
    };
  }, [tasks]);

  return (
    <DashboardLayout>
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Hello, {user?.name || 'User'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here is a breakdown of your items and task statistics.
        </p>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Total Tasks"
          value={statistics.total}
          icon={ClipboardList}
          color="indigo"
        />
        <StatCard
          title="Completed %"
          value={statistics.completedPercent}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Overdue Tasks"
          value={statistics.overdue}
          icon={Clock}
          color={statistics.overdue > 0 ? 'rose' : 'amber'}
        />
      </div>

      {/* Main tasks container */}
      <div className="relative flex-grow">
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Restoring objectives...</span>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditClick}
            onDeleteTask={handleDeleteTask}
            onAddTaskClick={handleAddTaskClick}
          />
        )}
      </div>

      {/* Task Modal Editor */}
      {modalOpen && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          isLoading={actionLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
