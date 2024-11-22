import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { Document, Page, pdfjs } from 'react-pdf';
import { Header } from './Header';
import { NERAnnotator } from './NERAnnotator';
import { PDFViewer } from './PDFViewer';
import { PDFControls } from './PDFControls';
import type { OCRResponse, MedicalNotesResponse, Entity, PageMapping } from '../types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SplitLayoutProps {
  pdfUrl: string;
  ocrData: OCRResponse;
  medicalNotes: MedicalNotesResponse;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ pdfUrl, ocrData, medicalNotes }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPageTime, setCurrentPageTime] = useState(0);
  const [pageTimes, setPageTimes] = useState<{ [key: number]: number }>({});
  const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set([1]));
  const [scale, setScale] = useState(0.85);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const [layoutMode, setLayoutMode] = useState<'split' | 'pdf' | 'annotator'>('split');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [availableEntities, setAvailableEntities] = useState<string[]>([]);
  const [pageAnnotations, setPageAnnotations] = useState<{ [key: string]: Entity[] }>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Reset to page 1 when PDF URL changes
  useEffect(() => {
    setPageNumber(1);
    setCurrentPageTime(0);
    setPageTimes({});
    setVisitedPages(new Set([1]));
  }, [pdfUrl]);

  useEffect(() => {
    // Update entities when medicalNotes changes
    const entities = new Set<string>();
    const initialAnnotations: { [key: string]: Entity[] } = {};

    Object.entries(medicalNotes.page_mappings).forEach(([page, mappings]) => {
      initialAnnotations[page] = mappings.map(mapping => {
        entities.add(mapping.icd_code);
        return {
          id: `${mapping.icd_code}-${mapping.position[0]}-${mapping.position[1]}`,
          text: mapping.text,
          type: mapping.icd_code,
          start: mapping.position[0],
          end: mapping.position[1],
          icd_code: mapping.icd_code
        };
      });
    });

    setPageAnnotations(initialAnnotations);
    setAvailableEntities(Array.from(entities));
  }, [medicalNotes]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.pdf-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isTabVisible) {
        setCurrentPageTime((prev) => prev + 1);
        setPageTimes((prev) => ({
          ...prev,
          [pageNumber]: (prev[pageNumber] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pageNumber, isTabVisible]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (newPage: number) => {
    if (numPages && newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      setVisitedPages((prev) => new Set([...prev, newPage]));
      setCurrentPageTime(pageTimes[newPage] || 0);
    }
  };

  const handleZoom = (newScale: number) => {
    let validScale = Math.min(1.5, Math.max(0.6, newScale));
    
    if (validScale >= 0.8 && validScale <= 1.0) {
      validScale = Math.round(validScale * 20) / 20;
    } else {
      validScale = Math.round(validScale * 10) / 10;
    }
    
    setScale(validScale);
  };

  const handleLayoutChange = (newMode: 'split' | 'pdf' | 'annotator') => {
    setIsTransitioning(true);
    setLayoutMode(newMode);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleAddEntity = (entity: string) => {
    setAvailableEntities(prev => {
      if (!prev.includes(entity)) {
        return [...prev, entity];
      }
      return prev;
    });
  };

  const handleUpdateAnnotations = (pageNum: number, annotations: Entity[]) => {
    setPageAnnotations(prev => ({
      ...prev,
      [pageNum]: annotations
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const totalPageTime = Object.values(pageTimes).reduce((sum, time) => sum + time, 0);
  const currentPageContent = ocrData.pages[pageNumber.toString()] || '';
  const currentPageMappings = medicalNotes.page_mappings[pageNumber.toString()] || [];

  return (
    <div className="h-screen flex flex-col">
      <Header 
        taskNumber={1} 
        labeledCount={0} 
        pages={ocrData.pages}
        onPageSelect={handlePageChange}
        onSearch={handleSearch}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          layoutMode !== 'split' ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}>
          <Split 
            className="h-full flex split"
            sizes={[55, 45]}
            minSize={300}
            gutterSize={10}
            snapOffset={0}
          >
            <div className="h-full flex flex-col pdf-container">
              <PDFControls
                pageNumber={pageNumber}
                numPages={numPages}
                scale={scale}
                currentPageTime={currentPageTime}
                totalPageTime={totalPageTime}
                onPageChange={handlePageChange}
                onZoom={handleZoom}
                layoutMode={layoutMode}
                onLayoutChange={handleLayoutChange}
              />
              <PDFViewer
                pdfUrl={pdfUrl}
                pageNumber={pageNumber}
                scale={scale}
                containerWidth={containerWidth}
                onPageChange={handlePageChange}
                onDocumentLoadSuccess={onDocumentLoadSuccess}
              />
            </div>

            <div className="h-full overflow-hidden">
              <NERAnnotator 
                text={currentPageContent}
                pageNumber={pageNumber}
                numPages={numPages}
                availableEntities={availableEntities}
                pageMappings={currentPageMappings}
                allPageMappings={medicalNotes.page_mappings}
                layoutMode={layoutMode}
                onLayoutChange={handleLayoutChange}
                onPageChange={handlePageChange}
                onAddEntity={handleAddEntity}
                annotations={pageAnnotations[pageNumber] || []}
                allAnnotations={pageAnnotations}
                onUpdateAnnotations={(annotations) => handleUpdateAnnotations(pageNumber, annotations)}
                searchTerm={searchTerm}
              />
            </div>
          </Split>
        </div>

        {/* Full PDF view */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
          layoutMode === 'pdf' 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}>
          <div className="h-full flex flex-col">
            <PDFControls
              pageNumber={pageNumber}
              numPages={numPages}
              scale={scale}
              currentPageTime={currentPageTime}
              totalPageTime={totalPageTime}
              onPageChange={handlePageChange}
              onZoom={handleZoom}
              layoutMode={layoutMode}
              onLayoutChange={handleLayoutChange}
            />
            <PDFViewer
              pdfUrl={pdfUrl}
              pageNumber={pageNumber}
              scale={scale}
              containerWidth={window.innerWidth}
              onPageChange={handlePageChange}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
            />
          </div>
        </div>

        {/* Full annotator view */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
          layoutMode === 'annotator' 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          <NERAnnotator 
            text={currentPageContent}
            pageNumber={pageNumber}
            numPages={numPages}
            availableEntities={availableEntities}
            pageMappings={currentPageMappings}
            allPageMappings={medicalNotes.page_mappings}
            layoutMode={layoutMode}
            onLayoutChange={handleLayoutChange}
            onPageChange={handlePageChange}
            onAddEntity={handleAddEntity}
            annotations={pageAnnotations[pageNumber] || []}
            allAnnotations={pageAnnotations}
            onUpdateAnnotations={(annotations) => handleUpdateAnnotations(pageNumber, annotations)}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};