import React, { useState } from 'react';
import { TextAnnotator } from './TextAnnotator';
import { AnnotatedEntities } from './AnnotatedEntities';
import { GlobalAnnotations } from './GlobalAnnotations';
import { ICDSearch } from './ICDSearch';
import { Entity, PageMapping } from '../types';
import { getEntityColor } from '../utils/colors';

interface MinimizedAnnotatorProps {
  text: string;
  pageNumber: number;
  numPages: number | null;
  availableEntities: string[];
  layoutMode: 'split' | 'pdf' | 'annotator';
  onLayoutChange: (mode: 'split' | 'pdf' | 'annotator') => void;
  onPageChange: (page: number) => void;
  onAddEntity: (entity: string) => void;
  annotations: Entity[];
  allAnnotations: { [key: string]: Entity[] };
  selectedType: string;
  setSelectedType: (type: string) => void;
  showGlobal: boolean;
  setShowGlobal: (show: boolean) => void;
  onTextSelection: () => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
}

export const MinimizedAnnotator: React.FC<MinimizedAnnotatorProps> = ({
  text,
  pageNumber,
  numPages,
  availableEntities,
  layoutMode,
  onLayoutChange,
  onPageChange,
  onAddEntity,
  annotations,
  allAnnotations,
  selectedType,
  setSelectedType,
  showGlobal,
  setShowGlobal,
  onTextSelection,
  onDelete,
  searchTerm = ''
}) => {
  const [inputPage, setInputPage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value);
      setError(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputPage) {
      const newPage = parseInt(inputPage, 10);
      handlePageChange(newPage);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (!numPages) {
      setError('Document not loaded');
      return;
    }

    if (newPage < 1 || newPage > numPages) {
      setError(`Page must be between 1 and ${numPages}`);
      return;
    }

    onPageChange(newPage);
    setInputPage('');
    setError(null);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between h-[52px]">
        <div className="flex items-center gap-3">
          <h2 className="font-medium text-gray-800 text-[11pt]">Medical Document Annotator</h2>
          {error && (
            <span className="text-red-500 text-[9pt]">{error}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {layoutMode !== 'split' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                disabled={!numPages || pageNumber <= 1}
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
                <span className="text-gray-800 text-[9pt]">of {numPages || '-'}</span>
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
          )}

          <button
            onClick={() => onLayoutChange('annotator')}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            title="Expand Annotations"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l4 4m12-4v4m0-4h-4m4 0l-4 4M4 20v-4m0 4h4m-4 0l4-4m12 4l-4-4m4 4v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <ICDSearch 
            onResultsChange={() => {}}
            onAddEntity={onAddEntity}
          />

          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[9pt]"
            >
              <option value="">Select an entity type</option>
              {availableEntities.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableEntities.map(type => (
              <div key={type} className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-[9pt] font-medium ${getEntityColor(type)}`}
                >
                  {type}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowGlobal(!showGlobal)}
              className="px-4 py-1.5 text-[9pt] font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              {showGlobal ? 'Show Current Page' : 'Show All Pages'}
            </button>
          </div>
        </div>

        {!showGlobal && (
          <TextAnnotator 
            text={text}
            entities={annotations}
            onTextSelection={onTextSelection}
            searchTerm={searchTerm}
          />
        )}

        {showGlobal ? (
          <GlobalAnnotations
            allEntities={allAnnotations}
            currentPage={pageNumber}
            onEditEntity={() => {}}
            onDeleteEntity={(pageNum, entityId) => {
              if (pageNum === pageNumber) {
                onDelete(entityId);
              }
            }}
            onPageChange={onPageChange}
          />
        ) : (
          <AnnotatedEntities 
            entities={annotations} 
            onDelete={onDelete} 
          />
        )}
      </div>
    </>
  );
};