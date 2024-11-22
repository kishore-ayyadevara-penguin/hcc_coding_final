import React, { useState, useEffect } from 'react';
import { Entity } from '../types';
import { EntityPopup } from './EntityPopup';
import { PageAccordionItem } from './PageAccordionItem';

interface GlobalAnnotationsProps {
  allEntities: { [pageNumber: string]: Entity[] };
  currentPage: number;
  onEditEntity: (pageNumber: number, entity: Entity) => void;
  onDeleteEntity: (pageNumber: number, entityId: string) => void;
  onPageChange: (page: number) => void;
}

export const GlobalAnnotations: React.FC<GlobalAnnotationsProps> = ({
  allEntities,
  currentPage,
  onEditEntity,
  onDeleteEntity,
  onPageChange,
}) => {
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([currentPage]));
  const [selectedEntity, setSelectedEntity] = useState<{ entity: Entity; page: number } | null>(null);

  useEffect(() => {
    setExpandedPages(prev => new Set([...prev, currentPage]));
  }, [currentPage]);

  const sortedPages = Object.entries(allEntities)
    .map(([page, entities]) => ({
      pageNumber: parseInt(page),
      entities
    }))
    .filter(({ entities }) => entities.length > 0)
    .sort((a, b) => a.pageNumber - b.pageNumber);

  const totalAnnotations = sortedPages.reduce((sum, { entities }) => sum + entities.length, 0);

  const handlePageToggle = (pageNumber: number) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  const handleEntityClick = (entity: Entity, pageNumber: number) => {
    setSelectedEntity({ entity, page: pageNumber });
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-800">
          All Pages
        </h2>
        <span className="text-sm text-gray-500">
          {totalAnnotations} Total Annotation{totalAnnotations !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sortedPages.map(({ pageNumber, entities }) => (
          <PageAccordionItem
            key={pageNumber}
            pageNumber={pageNumber}
            entities={entities}
            isExpanded={expandedPages.has(pageNumber)}
            isCurrentPage={pageNumber === currentPage}
            onToggle={() => handlePageToggle(pageNumber)}
            onEntityClick={(entity) => handleEntityClick(entity, pageNumber)}
            onDeleteEntity={(entityId) => onDeleteEntity(pageNumber, entityId)}
            onEditEntity={(entity) => onEditEntity(pageNumber, entity)}
            onPageClick={() => handlePageClick(pageNumber)}
          />
        ))}

        {sortedPages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No annotations found in any page
          </div>
        )}
      </div>

      {selectedEntity && (
        <EntityPopup 
          entity={selectedEntity.entity}
          pageNumber={selectedEntity.page}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  );
};