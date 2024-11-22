import React, { useState, useRef, useEffect } from 'react';
import { getEntityColor } from '../utils/colors';

interface EntityTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  availableEntities: string[];
  onSubmit: () => void;
  layoutMode: 'split' | 'pdf' | 'annotator';
  onLayoutChange: (mode: 'split' | 'pdf' | 'annotator') => void;
}

export const EntityTypeSelector: React.FC<EntityTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  availableEntities,
  onSubmit,
  layoutMode,
  onLayoutChange,
}) => {
  const [fontSize, setFontSize] = useState(11);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" ref={containerRef}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 style={{ fontSize: `${fontSize + 2}px` }} className="font-medium text-gray-800">
            Medical Document Annotator
          </h2>
          <div className="flex items-center gap-2">
            {layoutMode === 'split' ? (
              <button
                onClick={() => onLayoutChange('annotator')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                title="Expand Annotations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8V4m0 0h4M3 4l4 4m14-4v4m0-4h-4m4 0l-4 4M3 20v-4m0 4h4m-4 0l4-4m14 4l-4-4m4 4v-4m0 4h-4" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => onLayoutChange('split')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                title="Exit Fullscreen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4h5M15 9l5-5m0 0l-5-5m5 5h-5M9 15l-5 5m0 0l5 5M4 20h5m6-5l5 5m0 0l-5 5m5-5h-5" />
                </svg>
              </button>
            )}
            <button
              onClick={onSubmit}
              className="px-4 py-2 font-medium text-white bg-[#6366F1] rounded-lg hover:bg-[#5558E8] transition-colors h-[34px]"
              style={{ fontSize: `${fontSize}px` }}
            >
              Submit Annotations
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: `${fontSize}px` }}
            >
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
        </div>

        <div className="flex flex-wrap gap-2">
          {availableEntities.map(type => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full font-medium ${getEntityColor(type)}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};