import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading VOXIA AI Studio...',
  subtext = 'Connecting to neural voice engines',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl -z-10 animate-pulse" />
      </div>
      <h4 className="font-semibold text-slate-200 text-sm">{message}</h4>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
};
