import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  pages: { [key: string]: string };
  onPageSelect: (page: number) => void;
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ pages, onPageSelect, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: number; count: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        const results: { page: number; count: number }[] = [];
        
        Object.entries(pages).forEach(([pageNum, content]) => {
          const regex = new RegExp(searchTerm, 'gi');
          const matches = content.match(regex);
          if (matches) {
            results.push({
              page: parseInt(pageNum),
              count: matches.length
            });
          }
        });

        results.sort((a, b) => b.count - a.count);
        setSearchResults(results);
        setIsSearching(false);
        onSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, pages, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      inputRef.current?.blur();
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search in document..."
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[9pt] text-gray-800 placeholder-gray-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {searchResults.length > 0 && searchTerm.trim().length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {searchResults.map(({ page, count }) => (
            <button
              key={page}
              onClick={() => {
                onPageSelect(page);
                setSearchTerm('');
                inputRef.current?.blur();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span className="text-[9pt] text-gray-800">Page {page}</span>
              <span className="text-[8pt] text-gray-500">{count} occurrence{count !== 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      )}

      {searchTerm.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
        <div className="absolute w-full mt-1 px-4 py-2 bg-gray-50 text-gray-600 text-[9pt] rounded-lg border border-gray-200">
          No results found
        </div>
      )}
    </div>
  );
};