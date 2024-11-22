import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { MinimizedAnnotator } from './MinimizedAnnotator';
import { MaximizedAnnotator } from './MaximizedAnnotator';
import { Entity, PageMapping } from '../types';

interface AnnotatorProps {
  text: string;
  pageNumber: number;
  numPages: number | null;
  availableEntities: string[];
  pageMappings: PageMapping[];
  allPageMappings: { [key: string]: PageMapping[] };
  layoutMode: 'split' | 'pdf' | 'annotator';
  onLayoutChange: (mode: 'split' | 'pdf' | 'annotator') => void;
  onPageChange: (page: number) => void;
  onAddEntity: (entity: string) => void;
  annotations: Entity[];
  allAnnotations: { [key: string]: Entity[] };
  onUpdateAnnotations: (annotations: Entity[]) => void;
  searchTerm?: string;
}

export const NERAnnotator: React.FC<AnnotatorProps> = (props) => {
  const [selectedType, setSelectedType] = useState('');
  const [showGlobal, setShowGlobal] = useState(false);

  useEffect(() => {
    if (props.availableEntities.length > 0) {
      if (!props.availableEntities.includes(selectedType)) {
        setSelectedType(props.availableEntities[0]);
      }
    } else {
      setSelectedType('');
    }
  }, [props.availableEntities, selectedType]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selectedType) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const textContent = container.textContent;
    if (!textContent) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    let textContainer = container;
    while (textContainer && !textContainer.classList?.contains('text-content')) {
      textContainer = textContainer.parentElement;
    }
    if (!textContainer) return;

    let start = 0;
    const treeWalker = document.createTreeWalker(
      textContainer,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while ((node = treeWalker.nextNode())) {
      if (node === range.startContainer) {
        start += range.startOffset;
        break;
      }
      start += node.textContent?.length || 0;
    }

    const newEntity: Entity = {
      id: `manual-${Date.now()}`,
      text: selectedText,
      type: selectedType,
      start,
      end: start + selectedText.length
    };

    props.onUpdateAnnotations([...props.annotations, newEntity]);
    selection.removeAllRanges();
  };

  const handleDelete = (id: string) => {
    props.onUpdateAnnotations(props.annotations.filter(entity => entity.id !== id));
  };

  const commonProps = {
    ...props,
    selectedType,
    setSelectedType,
    showGlobal,
    setShowGlobal,
    onTextSelection: handleTextSelection,
    onDelete: handleDelete
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {props.layoutMode === 'annotator' ? (
        <MaximizedAnnotator {...commonProps} />
      ) : (
        <MinimizedAnnotator {...commonProps} />
      )}
    </div>
  );
};