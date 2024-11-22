import React, { useState, useEffect } from 'react';
import { fetchRuns, fetchRunData } from '../services/api';
import type { OCRResponse, MedicalNotesResponse } from '../types';

interface RunInfo {
  id: string;
  filename: string;
}

interface RunNavigatorProps {
  currentRunId: string | null;
  onRunChange: (runId: string, pdfUrl: string, ocrData: OCRResponse, medicalNotes: MedicalNotesResponse) => void;
}

export const RunNavigator: React.FC<RunNavigatorProps> = ({ currentRunId, onRunChange }) => {
  const [allRuns, setAllRuns] = useState<RunInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialRunId, setInitialRunId] = useState<string | null>(null);

  useEffect(() => {
    loadRuns();
  }, []);

  useEffect(() => {
    if (currentRunId && !initialRunId) {
      setInitialRunId(currentRunId);
    }
  }, [currentRunId]);

  const loadRuns = async () => {
    try {
      const runsData = await fetchRuns();
      const runsArray = Object.entries(runsData.runs)
        .map(([id, filename]) => ({
          id,
          filename
        }));
      setAllRuns(runsArray);
    } catch (err) {
      setError('Failed to load runs');
      console.error(err);
    }
  };

  const handleRunChange = async (runId: string) => {
    if (runId === currentRunId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { pdfUrl, ocrData, medicalNotes } = await fetchRunData(runId);
      // Reset to page 1 when switching runs
      if (ocrData.pages) {
        ocrData.pages = { 
          "1": ocrData.pages["1"], 
          ...Object.fromEntries(
            Object.entries(ocrData.pages)
              .filter(([page]) => page !== "1")
          )
        };
      }
      onRunChange(runId, pdfUrl, ocrData, medicalNotes);
    } catch (err) {
      setError('Failed to load run data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentIndex = () => {
    return allRuns.findIndex(run => run.id === currentRunId);
  };

  const handlePrevRun = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      handleRunChange(allRuns[currentIndex - 1].id);
    }
  };

  const handleNextRun = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < allRuns.length - 1) {
      handleRunChange(allRuns[currentIndex + 1].id);
    }
  };

  const truncateFilename = (filename: string, maxLength: number = 20) => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split('.').pop() || '';
    const nameWithoutExt = filename.slice(0, filename.length - extension.length - 1);
    const truncatedName = nameWithoutExt.slice(0, maxLength - 3 - extension.length);
    return `${truncatedName}...${extension}`;
  };

  if (allRuns.length === 0) return null;

  const currentIndex = getCurrentIndex();
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allRuns.length - 1;

  const getRunButtonStyles = (runId: string) => {
    if (runId === currentRunId) {
      if (runId === initialRunId) {
        return 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2';
      }
      return 'bg-indigo-600 text-white';
    }
    if (runId === initialRunId) {
      return 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-1 ring-emerald-600';
    }
    return isLoading 
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Documents:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevRun}
              disabled={!hasPrev || isLoading}
              className={`p-1.5 rounded-lg transition-colors ${
                !hasPrev || isLoading
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Previous document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {allRuns.map((run) => (
                <button
                  key={run.id}
                  onClick={() => handleRunChange(run.id)}
                  disabled={isLoading}
                  title={run.filename}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${getRunButtonStyles(run.id)}`}
                >
                  {truncateFilename(run.filename)}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextRun}
              disabled={!hasNext || isLoading}
              className={`p-1.5 rounded-lg transition-colors ${
                !hasNext || isLoading
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Next document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Loading document...
          </div>
        )}

        {error && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
    </div>
  );
};