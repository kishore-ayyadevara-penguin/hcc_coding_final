import React, { useState, useEffect } from 'react';

interface Step {
  id: number;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  hasApi: boolean;
}

interface ProcessingStepsProps {
  isVisible: boolean;
  currentStep?: number;
  error?: string | null;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ 
  isVisible, 
  currentStep = 0,
  error = null
}) => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: 'OCR Processing', status: 'pending', hasApi: true },
    { id: 2, name: 'PII Redaction', status: 'pending', hasApi: true },
    { id: 3, name: 'Disease Extraction', status: 'pending', hasApi: true },
    { id: 4, name: 'Get ICD Codes', status: 'pending', hasApi: true },
    { id: 5, name: 'Fill ICD Codes', status: 'pending', hasApi: true },
    { id: 6, name: 'HCC Code Mapping', status: 'pending', hasApi: true }
  ]);

  useEffect(() => {
    if (!isVisible) return;

    // Update current step status
    if (currentStep > 0) {
      setSteps(current =>
        current.map(step => ({
          ...step,
          status: step.id < currentStep ? 'completed' 
                 : step.id === currentStep ? 'processing'
                 : 'pending'
        }))
      );
    }

    // Handle error state
    if (error) {
      setSteps(current =>
        current.map(step => ({
          ...step,
          status: step.id === currentStep ? 'error' : step.status
        }))
      );
    }
  }, [isVisible, currentStep, error]);

  return (
    <div className="mt-6 w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-[13px] font-semibold mb-6 text-gray-800">Processing Document</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 ${
              step.status === 'pending' ? 'opacity-40' : ''
            }`}
          >
            <div className="w-5 h-5 flex-shrink-0">
              {step.status === 'completed' ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : step.status === 'processing' ? (
                <svg
                  className="w-5 h-5 text-indigo-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : step.status === 'error' ? (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              )}
            </div>
            <span
              className={`text-[11px] ${
                step.status === 'pending'
                  ? 'text-gray-400'
                  : step.status === 'error'
                  ? 'text-red-600'
                  : 'text-gray-800 font-medium'
              }`}
            >
              {step.name}
              {step.status === 'error' && error && (
                <span className="ml-2 text-red-500">({error})</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};