import React, { useState, useEffect, useRef } from 'react';
import { Entity } from '../types';
import { getEntityColor } from '../utils/colors';

interface AnnotatedEntitiesProps {
  entities: Entity[];
  onDelete: (id: string) => void;
}

interface PopupProps {
  entity: Entity;
  onClose: () => void;
}

const EntityPopup: React.FC<PopupProps> = ({ entity, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <span className="text-sm text-gray-500">Entity: </span>
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

export const AnnotatedEntities: React.FC<AnnotatedEntitiesProps> = ({ entities, onDelete }) => {
  const [fontSize, setFontSize] = useState(11);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newSize = Math.min(14, Math.max(11, (width / 400) * 11));
        setFontSize(newSize);
      }
    };

    const resizeObserver = new ResizeObserver(updateFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" ref={containerRef}>
      <h2 className="font-medium text-gray-800 mb-4" style={{ fontSize: `${fontSize + 2}px` }}>
        Annotated Entities
      </h2>
      {entities.length === 0 ? (
        <p className="text-gray-500" style={{ fontSize: `${fontSize}px` }}>
          Select text and choose an entity type to start annotating
        </p>
      ) : (
        <ul className="space-y-2">
          {entities.map((entity) => (
            <li
              key={entity.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedEntity(entity)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span 
                  className={`px-2 py-0.5 rounded-full font-medium truncate ${getEntityColor(entity.type)}`}
                  style={{ fontSize: `${fontSize}px`, maxWidth: '120px' }}
                >
                  {truncateText(entity.type, 25)}
                </span>
                <span 
                  className="text-gray-600 truncate"
                  style={{ fontSize: `${fontSize}px`, maxWidth: '200px' }}
                >
                  "{truncateText(entity.text, 40)}"
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entity.id);
                }}
                className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                title="Delete entity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedEntity && (
        <EntityPopup 
          entity={selectedEntity} 
          onClose={() => setSelectedEntity(null)} 
        />
      )}
    </div>
  );
};