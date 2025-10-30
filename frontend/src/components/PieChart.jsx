import React from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function PieChart({ completed = 0, ongoing = 0, size = 200 }) {
  const { t } = useLanguage();
  const total = Math.max(0, completed) + Math.max(0, ongoing);
  const radius = (size / 2) - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const completedPct = total === 0 ? 0 : completed / total;
  const ongoingPct = total === 0 ? 0 : ongoing / total;

  const strokeWidth = 20;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid meet" className="w-full h-48 md:h-56 transform -rotate-90">
        <defs>
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="ongoingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={radius} 
          fill="none" 
          stroke="#f8fafc" 
          strokeWidth={strokeWidth}
          className="drop-shadow-sm"
        />

        {/* Completed arc (gradient green) */}
        {completedPct > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="url(#completedGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * completedPct} ${circumference}`}
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />
        )}

        {/* Ongoing arc stacked after completed (gradient blue) */}
        {ongoingPct > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="url(#ongoingGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * ongoingPct} ${circumference}`}
            strokeDashoffset={-circumference * completedPct}
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />
        )}

        {/* Animated rings for visual interest */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + 4}
          fill="none"
          stroke="url(#completedGradient)"
          strokeWidth="1"
          opacity="0.3"
          className="animate-pulse"
        />
      </svg>

  {/* Center labels - properly positioned without rotation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">
          {total === 0 ? "—" : Math.round(completedPct * 100) + "%"}
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/60 mb-1">
          {t("completed")}
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {completed}/{total} works
        </div>
      </div>

      {/* Floating animation element */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-0 animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}

export function PieLegend({ completed = 0, ongoing = 0 }) {
  const total = Math.max(0, completed) + Math.max(0, ongoing);
  const pct = (v) => (total === 0 ? 0 : Math.round((v / total) * 100));
  const { t } = useLanguage();

  const Item = ({ color, gradient, label, value, percentage }) => (
    <div className="group flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="relative">
        <div className={`w-4 h-4 rounded ${gradient} group-hover:scale-110 transition-transform duration-200 shadow-sm`}></div>
        <div className="absolute inset-0 rounded bg-current opacity-0 group-hover:opacity-30 animate-ping"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-sm capitalize group-hover:text-slate-900 transition-colors">
            {t(label)}
          </span>
          <span className="font-bold text-slate-700 text-sm">
            {value}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="w-16 bg-slate-200 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${percentage}%`,
                background: color
              }}
            ></div>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 grid grid-cols-1 gap-3">
      <Item 
        color="#10b981"
        gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
        label="completed" 
        value={completed} 
        percentage={pct(completed)} 
      />
      <Item 
        color="#3b82f6"
        gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        label="ongoing" 
        value={ongoing} 
        percentage={pct(ongoing)} 
      />
      
      {/* Total summary */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-slate-700">Total Works</span>
          <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}