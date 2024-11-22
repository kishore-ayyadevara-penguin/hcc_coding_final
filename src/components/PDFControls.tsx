import React, { useState } from 'react';

interface PDFControlsProps {
  pageNumber: number;
  numPages: number | null;
  scale: number;
  currentPageTime: number;
  totalPageTime: number;
  onPageChange: (page: number) => void;
  onZoom: (scale: number) => void;
  layoutMode: 'split' | 'pdf' | 'annotator';
  onLayoutChange: (mode: 'split' | 'pdf' | 'annotator') => void;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  pageNumber,
  numPages,
  scale,
  currentPageTime,
  totalPageTime,
  onPageChange,
  onZoom,
  layoutMode,
  onLayoutChange,
}) => {
  const [inputPage, setInputPage] = useState('');

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputPage) {
      const newPage = parseInt(inputPage, 10);
      handlePageChange(newPage);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (numPages && newPage >= 1 && newPage <= numPages) {
      onPageChange(newPage);
      setInputPage('');
    }
  };

  return (
    <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-gray-200 h-[52px]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 border border-gray-200 text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder={pageNumber.toString()}
              className="w-14 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 text-[9pt]"
            />
            <span className="text-gray-800 text-[9pt]">of {numPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(Math.min(numPages || 1, pageNumber + 1))}
            disabled={!numPages || pageNumber >= numPages}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 border border-gray-200 text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-lg">
          <div className="flex items-center gap-2 text-[9pt] text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(currentPageTime)}
          </div>
          <span className="text-gray-300">|</span>
          <div className="text-[9pt] text-gray-600">
            Total: {formatTime(totalPageTime)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg">
          <button
            onClick={() => onZoom(scale - (scale >= 0.8 && scale <= 1.0 ? 0.05 : 0.1))}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-800"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="min-w-[3.5rem] text-center font-medium text-gray-800 text-[9pt]">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onZoom(scale + (scale >= 0.75 && scale <= 0.95 ? 0.05 : 0.1))}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-800"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {layoutMode === 'split' ? (
          <button
            onClick={() => onLayoutChange('pdf')}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            title="Expand PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l4 4m12-4v4m0-4h-4m4 0l-4 4M4 20v-4m0 4h4m-4 0l4-4m12 4l-4-4m4 4v-4m0 4h-4" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => onLayoutChange('split')}
            className="text-red-500 hover:text-red-700"
            title="Exit Fullscreen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};