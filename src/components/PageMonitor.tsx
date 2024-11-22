import React from 'react';

interface PageMonitorProps {
  currentPage: number;
  totalPages: number;
  currentPageTime: number;
  totalPageTime: number;
}

export const PageMonitor: React.FC<PageMonitorProps> = ({
  currentPage,
  totalPages,
  currentPageTime,
  totalPageTime,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 space-y-2 z-10">
      <div className="text-sm text-gray-600">
        <span className="inline-block mr-2">
          <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        Current page time: {formatTime(currentPageTime)}
      </div>
      <div className="text-sm text-gray-600">
        Total time on page: {formatTime(totalPageTime)}
      </div>
      <div className="text-sm text-gray-600">
        Pages visited: {currentPage} of {totalPages}
      </div>
    </div>
  );
};