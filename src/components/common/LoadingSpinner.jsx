import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-[#2F80FF] animate-spin mb-2`} />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
};

export const PageLoadingSpinner = ({ text = 'Loading page...' }) => {
  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
      <div className="glow-card p-8 rounded-2xl">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

export default LoadingSpinner;