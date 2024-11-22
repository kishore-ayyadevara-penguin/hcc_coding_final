import React from 'react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  taskNumber: number;
  labeledCount: number;
  onBack?: () => void;
  pages: { [key: string]: string };
  onPageSelect: (page: number) => void;
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  taskNumber, 
  labeledCount, 
  onBack,
  pages,
  onPageSelect,
  onSearch
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="w-64">
              <SearchBar 
                pages={pages}
                onPageSelect={onPageSelect}
                onSearch={onSearch}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">ICD Code Extraction</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Task {taskNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{labeledCount} Labeled</span>
          </div>
        </div>
      </div>
    </header>
  );
};