import React, { useState } from 'react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: APIConfiguration) => void;
}

export interface APIConfiguration {
  ocrModel: 'azure' | 'custom-vlm';
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [config, setConfig] = useState<APIConfiguration>({
    ocrModel: 'azure',
  });

  const handleConfirm = () => {
    onConfirm(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">API Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              OCR Model Selection
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:border-black checked:bg-white relative
                    before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:bg-black 
                    before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2
                    before:opacity-0 checked:before:opacity-100 transition-all duration-200"
                  checked={config.ocrModel === 'azure'}
                  onChange={() => setConfig({ ...config, ocrModel: 'azure' })}
                />
                <span className="ml-2 text-sm text-gray-700">Azure OCR</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="appearance-none w-4 h-4 rounded-full border-2 border-black checked:border-black checked:bg-white relative
                    before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:bg-black 
                    before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2
                    before:opacity-0 checked:before:opacity-100 transition-all duration-200"
                  checked={config.ocrModel === 'custom-vlm'}
                  onChange={() => setConfig({ ...config, ocrModel: 'custom-vlm' })}
                />
                <span className="ml-2 text-sm text-gray-700">Custom VLM</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="h-10 w-32 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="h-10 w-32 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirm Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};