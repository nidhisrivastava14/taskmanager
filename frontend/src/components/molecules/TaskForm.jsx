import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { X } from 'lucide-react';

/**
 * TaskForm Modal Component
 * Handles creating and editing tasks with live validation feedback
 */
const TaskForm = ({ task = null, onSave, onCancel, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  // Validation Errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Prefill values if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setErrors({});
    setTouched({});
  }, [task]);

  // Run validation
  const validate = (name, value) => {
    let errorMsg = '';
    if (name === 'title') {
      if (!value.trim()) {
        errorMsg = 'Title is required';
      } else if (value.trim().length < 3) {
        errorMsg = 'Title must be at least 3 characters';
      }
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (touched.title) {
      validate('title', val);
    }
  };

  const handleTitleBlur = () => {
    setTouched(prev => ({ ...prev, title: true }));
    validate('title', title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate title on submit
    const titleError = validate('title', title);
    setTouched(prev => ({ ...prev, title: true }));

    if (titleError) return;

    // Package data
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700/60 p-6 z-10 animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700/40">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors focus:outline-none"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <Input
            label="Task Title"
            id="title"
            placeholder="What needs to be done?"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            error={touched.title && errors.title}
            required
            disabled={isLoading}
          />

          {/* Description */}
          <div className="flex flex-col gap-1 w-full">
            <label 
              htmlFor="description" 
              className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Add optional task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:focus:ring-offset-slate-900"
            />
          </div>

          {/* Due Date */}
          <Input
            label="Due Date"
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
          />

          {/* Priority */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              Priority
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {['low', 'medium', 'high'].map((p) => {
                const colors = {
                  low: 'border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50/20 checked:bg-blue-600',
                  medium: 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 bg-amber-50/20 checked:bg-amber-600',
                  high: 'border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 bg-rose-50/20 checked:bg-rose-600'
                };
                const activeColors = {
                  low: 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600',
                  medium: 'bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:border-amber-500',
                  high: 'bg-rose-500 text-white border-rose-500 dark:bg-rose-600 dark:border-rose-600'
                };

                const isSelected = priority === p;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    disabled={isLoading}
                    className={`py-2 text-xs font-semibold capitalize rounded-lg border transition-all ${
                      isSelected 
                        ? activeColors[p] 
                        : `hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400`
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/40">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="px-6"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
