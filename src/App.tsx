import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { SplitLayout } from './components/SplitLayout';
import { RunNavigator } from './components/RunNavigator';
import type { OCRResponse, MedicalNotesResponse } from './types';
import './App.css';

export default function App() {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRResponse | null>(null);
  const [medicalNotes, setMedicalNotes] = useState<MedicalNotesResponse | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  const handlePdfUpload = (url: string, ocrData: OCRResponse, medicalNotes: MedicalNotesResponse, runId: string) => {
    setPdfFile(url);
    setOcrData(ocrData);
    setMedicalNotes(medicalNotes);
    setCurrentRunId(runId);
  };

  const handleRunChange = (runId: string, pdfUrl: string, ocrData: OCRResponse, medicalNotes: MedicalNotesResponse) => {
    setPdfFile(pdfUrl);
    setOcrData(ocrData);
    setMedicalNotes(medicalNotes);
    setCurrentRunId(runId);
  };

  return (
    <div className="h-screen">
      {!pdfFile ? (
        <LandingPage onPdfUpload={handlePdfUpload} />
      ) : (
        <div className="h-full flex flex-col">
          <RunNavigator 
            currentRunId={currentRunId}
            onRunChange={handleRunChange}
          />
          <div className="flex-1">
            <SplitLayout 
              pdfUrl={pdfFile} 
              ocrData={ocrData!}
              medicalNotes={medicalNotes!}
            />
          </div>
        </div>
      )}
    </div>
  );
}