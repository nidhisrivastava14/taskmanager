import React from 'react';
import Card from '../atoms/Card';

/**
 * StatCard Molecule
 * Renders individual dashboard metrics with titles, counts, and indicators
 */
const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  };

  return (
    <Card className="flex items-center justify-between border-l-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          {value}
        </span>
      </div>
      <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.indigo}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </Card>
  );
};

export default StatCard;
