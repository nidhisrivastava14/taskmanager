import React from 'react';
import Card from '../atoms/Card';
import { Calendar, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

/**
 * TaskCard Molecule
 * Renders task details, handles checkbox toggle, priority badge,
 * due date overdue warnings, and edit/delete actions.
 */
const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const { title, description, status, priority, dueDate } = task;

  const isCompleted = status === 'completed';

  // Compute overdue state
  const isOverdue = React.useMemo(() => {
    if (!dueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }, [dueDate, isCompleted]);

  // Priority color map
  const priorityBadge = {
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`group relative transition-all duration-200 border-t-4 hover:shadow-md ${
      isCompleted
        ? 'border-t-slate-300 dark:border-t-slate-700 opacity-70'
        : isOverdue
        ? 'border-t-rose-500 dark:border-t-rose-600'
        : priority === 'high'
        ? 'border-t-rose-400 dark:border-t-rose-500'
        : priority === 'medium'
        ? 'border-t-amber-400 dark:border-t-amber-500'
        : 'border-t-indigo-400 dark:border-t-indigo-500'
    }`}>
      <div className="flex gap-4">
        {/* Toggle Checkbox Button */}
        <button
          onClick={() => onToggleStatus(task)}
          className="mt-1 flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:text-slate-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          aria-label={isCompleted ? "Mark task pending" : "Mark task completed"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-50/50 dark:fill-indigo-950/20" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-base font-semibold truncate text-slate-800 dark:text-slate-100 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
              {title}
            </h3>
            {/* Priority Badge */}
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge[priority] || priorityBadge.medium}`}>
              {priority}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className={`text-sm text-slate-600 dark:text-slate-400 line-clamp-2 ${isCompleted ? 'line-through opacity-50' : ''}`}>
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/40">
            {/* Due Date Indicator */}
            {dueDate ? (
              <div className={`flex items-center gap-1.5 text-xs font-medium ${
                isCompleted 
                  ? 'text-slate-400 dark:text-slate-500' 
                  : isOverdue 
                  ? 'text-rose-500 dark:text-rose-400' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(dueDate)}</span>
                {isOverdue && !isCompleted && <span className="ml-1 text-[9px] uppercase font-bold text-rose-500 animate-pulse">Overdue</span>}
              </div>
            ) : (
              <div className="text-xs text-slate-400 dark:text-slate-600 italic">No due date</div>
            )}

            {/* Quick Actions (Edit, Delete) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50 transition-colors"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-slate-700/50 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
