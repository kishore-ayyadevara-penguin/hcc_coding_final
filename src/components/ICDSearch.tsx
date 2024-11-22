import React, { useState, useEffect, useRef } from 'react';
import { searchICDCodes } from '../services/icdSearch';

interface ICDSearchProps {
  onResultsChange: (results: string[]) => void;
  onAddEntity: (entity: string) => void;
}

interface ICDResult {
  code: string;
  description: string;
  display: string;
}

export const ICDSearch: React.FC<ICDSearchProps> = ({ onResultsChange, onAddEntity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ICDResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ICDResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length >= 3 && !selectedResult) {
        setIsSearching(true);
        setError(null);
        try {
          const searchResults = await searchICDCodes(searchQuery);
          if (Object.keys(searchResults).length === 0) {
            setError('No results found');
          }
          const formattedResults = Object.entries(searchResults).map(([code, description]) => ({
            code,
            description,
            display: `${code} - ${description}`
          }));
          setResults(formattedResults);
          onResultsChange(formattedResults.map(r => r.display));
          setIsDropdownOpen(true);
        } catch (err) {
          setError('Failed to search ICD codes');
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else if (!selectedResult) {
        setError(null);
        setResults([]);
        onResultsChange([]);
        setIsDropdownOpen(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onResultsChange, selectedResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: ICDResult) => {
    setError(null);
    setSearchQuery(result.display);
    setSelectedResult(result);
    onResultsChange([result.display]);
    setIsDropdownOpen(false);
  };

  const handleAddEntity = () => {
    setError(null);
    if (selectedResult) {
      onAddEntity(selectedResult.display);
      setSearchQuery('');
      setSelectedResult(null);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setSelectedResult(null);
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for ICD codes..."
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[9pt] text-gray-800 placeholder-gray-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : selectedResult ? (
            <button
              onClick={handleAddEntity}
              className="flex items-center gap-1 px-2 py-1 text-[9pt] font-medium text-[#6366F1] hover:text-[#5558E8] transition-colors focus:outline-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute w-full mt-1 px-3 py-2 bg-red-50 text-red-600 text-[9pt] rounded-lg">
          {error}
        </div>
      )}

      {isDropdownOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-2 text-left text-[9pt] text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
            >
              {result.display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};