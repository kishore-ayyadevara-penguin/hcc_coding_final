import React, { useRef, useEffect } from 'react';
import { Entity } from '../types';
import { getEntityColor } from '../utils/colors';

interface PopupProps {
  entity: Entity;
  pageNumber: number;
  onClose: () => void;
}

export const EntityPopup: React.FC<PopupProps> = ({ entity, pageNumber, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="space-y-4 mt-2">
          <div>
            <span className="text-sm text-gray-500">Page: </span>
            <span className="text-gray-800">{pageNumber}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Entity Type: </span>
            <div className={`mt-1 inline-block px-3 py-1 rounded-full ${getEntityColor(entity.type)}`}>
              {entity.type}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Marked Text: </span>
            <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
              {entity.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};