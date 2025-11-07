
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gf-blue"></div>
      <p className="text-sm text-gf-gray-400">Fetching Market Data...</p>
    </div>
  );
};

export default LoadingSpinner;
