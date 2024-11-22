import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  pageNumber: number;
  scale: number;
  containerWidth: number;
  onPageChange: (page: number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  pageNumber,
  scale,
  containerWidth,
  onPageChange,
  onDocumentLoadSuccess,
}) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="min-h-full py-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
          loading={
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-4 text-red-500">
              Failed to load PDF. Please try again.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
            width={containerWidth}
            className="bg-white shadow-md"
            onLoadSuccess={() => onPageChange(pageNumber)}
            loading={
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center p-4 text-red-500">
                Failed to load page. Please try again.
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};