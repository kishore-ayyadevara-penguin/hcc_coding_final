import React, { useRef } from 'react';
import { Entity } from '../types';
import { getEntityColor } from '../utils/colors';

interface TextAnnotatorProps {
  text: string;
  entities: Entity[];
  onTextSelection: () => void;
  searchTerm?: string;
}

export const TextAnnotator: React.FC<TextAnnotatorProps> = ({ 
  text, 
  entities, 
  onTextSelection,
  searchTerm = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    onTextSelection();
  };

  const renderText = () => {
    if (!text) return null;

    let lastIndex = 0;
    const result = [];
    const segments: Array<{
      start: number;
      end: number;
      type: 'entity' | 'search';
      content: string;
      entityType?: string;
      icdCode?: string;
    }> = [];

    // Add entity segments
    entities.forEach(entity => {
      segments.push({
        start: entity.start,
        end: entity.end,
        type: 'entity',
        content: text.slice(entity.start, entity.end),
        entityType: entity.type,
        icdCode: entity.icd_code
      });
    });

    // Add search term segments if search term exists
    if (searchTerm.trim()) {
      const regex = new RegExp(searchTerm, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        segments.push({
          start: match.index,
          end: match.index + match[0].length,
          type: 'search',
          content: match[0]
        });
      }
    }

    // Sort segments by start position
    segments.sort((a, b) => a.start - b.start);

    // Handle overlapping segments
    const finalSegments = segments.reduce((acc, curr) => {
      if (acc.length === 0) {
        acc.push(curr);
        return acc;
      }

      const last = acc[acc.length - 1];
      if (curr.start < last.end) {
        // If current segment starts within the last segment
        if (curr.type === 'entity' && last.type === 'search') {
          // Entity takes precedence over search highlight
          acc.push(curr);
        }
        // Otherwise, keep the existing segment
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof segments);

    // Render segments with plain text in between
    finalSegments.forEach((segment, index) => {
      if (segment.start > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`} style={{ fontSize: '9pt' }}>
            {text.slice(lastIndex, segment.start)}
          </span>
        );
      }

      if (segment.type === 'entity') {
        result.push(
          <mark
            key={`entity-${index}`}
            className={`${getEntityColor(segment.entityType!)} rounded-md px-3 py-1 mx-1 font-medium`}
            style={{ fontSize: '10pt' }}
            title={`${segment.entityType}${segment.icdCode ? ` (${segment.icdCode})` : ''}`}
          >
            {segment.content}
          </mark>
        );
      } else {
        result.push(
          <mark
            key={`search-${index}`}
            className="bg-yellow-200 rounded-sm px-1 mx-0.5"
            style={{ fontSize: '9pt' }}
          >
            {segment.content}
          </mark>
        );
      }

      lastIndex = segment.end;
    });

    if (lastIndex < text.length) {
      result.push(
        <span key={`text-${lastIndex}`} style={{ fontSize: '9pt' }}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6" 
      ref={containerRef}
      onMouseUp={handleMouseUp}
    >
      <div className="text-content leading-relaxed text-gray-800 selection:bg-indigo-50 selection:font-medium whitespace-pre-wrap">
        {renderText()}
      </div>
    </div>
  );
};