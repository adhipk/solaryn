'use client';

import { useState, useEffect } from 'react';
import { WMF } from '../lib/wmf';

interface SearchPanelProps {
  onSearch: (name: string) => void;
}

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wmf = new WMF();

  useEffect(() => {
    if (inputValue.length > 0) {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        void wmf.getSuggestions(inputValue).then((response) => {
          setSuggestions(response.suggestions);
          setLoading(false);
        });
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      onSearch(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="mt-8 w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Start typing to search..."
            required
          />
          {loading && (
            <div className="absolute right-2 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="py-3 px-4 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Search
        </button>
      </form>
    </div>
  );
} 