import React from 'react';
import { Entity } from '../types';
import { getEntityColor } from '../utils/colors';

interface PageAccordionItemProps {
  pageNumber: number;
  entities: Entity[];
  isExpanded: boolean;
  isCurrentPage: boolean;
  onToggle: () => void;
  onEntityClick: (entity: Entity) => void;
  onDeleteEntity: (entityId: string) => void;
  onEditEntity: (entity: Entity) => void;
  onPageClick: () => void;
}

export const PageAccordionItem: React.FC<PageAccordionItemProps> = ({
  pageNumber,
  entities,
  isExpanded,
  isCurrentPage,
  onToggle,
  onEntityClick,
  onDeleteEntity,
  onEditEntity,
  onPageClick,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${
      isCurrentPage ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200'
    }`}>
      <div className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
        isCurrentPage ? 'hover:bg-indigo-50' : 'hover:bg-gray-50'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onPageClick}
            className="font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            style={{ fontSize: '9pt' }}
          >
            Page {pageNumber}
          </button>
          <span className="text-gray-500" style={{ fontSize: '9pt' }}>
            {entities.length} annotation{entities.length !== 1 ? 's' : ''}
          </span>
          {isCurrentPage && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full" style={{ fontSize: '8pt' }}>
              Current
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div 
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-4 space-y-2 bg-white">
          {entities.map(entity => (
            <div
              key={entity.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div 
                className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
                onClick={() => onEntityClick(entity)}
              >
                <span 
                  className={`px-3 py-1 rounded-full font-medium truncate ${getEntityColor(entity.type)}`}
                  style={{ maxWidth: '120px', fontSize: '9pt' }}
                >
                  {truncateText(entity.type, 20)}
                </span>
                <span 
                  className="text-gray-600 truncate"
                  style={{ maxWidth: '200px', fontSize: '9pt' }}
                >
                  "{truncateText(entity.text, 40)}"
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditEntity(entity)}
                  className="p-1 text-gray-400 hover:text-indigo-500 focus:outline-none transition-colors"
                  title="Edit entity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteEntity(entity.id)}
                  className="p-1 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                  title="Delete entity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};