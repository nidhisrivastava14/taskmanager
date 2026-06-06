import React from 'react';
import TaskCard from '../molecules/TaskCard';
import { Plus, Search, SlidersHorizontal, RotateCcw, CalendarRange } from 'lucide-react';
import Button from '../atoms/Button';

/**
 * TaskList Organism
 * Includes the filter controls toolbar and task cards list grid
 */
const TaskList = ({
  tasks,
  filters,
  onFilterChange,
  onClearFilters,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddTaskClick
}) => {
  // Local state to track search term
  const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

  // Debounce search update
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFilterChange('search', searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Handle inputs
  const handleInputChange = (field, value) => {
    onFilterChange(field, value);
  };

  // Local filtered tasks for in-memory text search
  const displayedTasks = React.useMemo(() => {
    if (!filters.search) return tasks;
    const lowerSearch = filters.search.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerSearch) || 
      (task.description && task.description.toLowerCase().includes(lowerSearch))
    );
  }, [tasks, filters.search]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Toolbar / Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow dark:focus:ring-offset-slate-900"
            />
          </div>

          {/* Add task CTA */}
          <Button
            onClick={onAddTaskClick}
            className="flex-shrink-0 shadow-lg shadow-indigo-500/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filter selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/40 items-end">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due date start range */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Due From
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Due date end range */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Due To
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Clear Filters helper */}
        {(filters.status || filters.priority || filters.startDate || filters.endDate || searchTerm) && (
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                onClearFilters();
              }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      {displayedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-sm">
          <CalendarRange className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            No tasks found
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            We couldn't find any tasks matching your selections. Try modifying your filter rules or create a new task.
          </p>
          <Button onClick={onAddTaskClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
