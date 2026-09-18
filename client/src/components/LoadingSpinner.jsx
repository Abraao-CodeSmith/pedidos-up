import React from 'react';

export const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <div className={`rounded-full border-purple-500/20 border-t-purple-400 border-r-violet-500 animate-spin ${sizeClasses[size]}`} />
        <div className="absolute inset-0 rounded-full blur-md bg-purple-500/30 animate-pulse" />
      </div>
      {text && (
        <span className="text-sm font-medium text-purple-300 tracking-wider animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export const SkeletonKanban = () => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {[1, 2, 3, 4].map((col) => (
        <div key={col} className="w-80 min-w-[320px] rounded-2xl glass-panel p-4 flex flex-col gap-4">
          <div className="h-6 w-32 bg-purple-500/20 rounded-lg animate-pulse" />
          <div className="space-y-3 mt-2">
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-14 bg-purple-900/30 border border-purple-500/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
