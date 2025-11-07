
import React, { useState } from 'react';
import type { StockScreenerResult } from '../types';
import { SearchIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface AIScreenerProps {
  onScreeningSearch: (query: string) => void;
  results: StockScreenerResult[];
  isLoading: boolean;
  error: string | null;
  onResultClick: (ticker: string) => void;
  reasoning: string;
  searchingTicker: string | null;
}

const AIScreener: React.FC<AIScreenerProps> = ({ onScreeningSearch, results, isLoading, error, onResultClick, reasoning, searchingTicker }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onScreeningSearch(query.trim());
    }
  };

  const ResultCard: React.FC<{ result: StockScreenerResult }> = ({ result }) => {
    const isCardLoading = searchingTicker === result.ticker;
    return (
      <div 
          onClick={() => !isCardLoading && onResultClick(result.ticker)}
          className={`relative bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 hover:border-gf-blue cursor-pointer transition-all duration-200 ${isCardLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
          {isCardLoading && (
            <div className="absolute inset-0 bg-gf-gray-900/50 flex items-center justify-center rounded-lg z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gf-blue"></div>
            </div>
          )}
          <h4 className="font-bold text-gf-blue">{result.companyName} ({result.ticker})</h4>
          <p className="text-sm text-gf-gray-300 mt-2">{result.explanation}</p>
          <div className="mt-3 pt-3 border-t border-gf-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {result.metrics.map(metric => (
                  <div key={metric.name}>
                      <span className="text-gf-gray-400">{metric.name}: </span>
                      <span className="font-medium text-gf-gray-200">{metric.value}</span>
                  </div>
              ))}
          </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gf-gray-200">AI Deep Search</h2>
        <p className="text-gf-gray-400 mt-1 text-sm">Ask complex questions to discover new investment opportunities.</p>
      </div>
      <form onSubmit={handleSearch}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Find U.S.-based semiconductor companies with a P/E ratio below 20..."
          className="w-full p-3 bg-gf-gray-800 border border-gf-gray-700 rounded-lg text-gf-gray-200 placeholder-gf-gray-400 focus:outline-none focus:ring-2 focus:ring-gf-blue min-h-[80px] resize-y"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-gf-blue text-gf-dark font-semibold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gf-dark focus:ring-gf-blue disabled:bg-gf-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gf-dark mr-3"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5 mr-2" />
              <span>Find Companies</span>
            </>
          )}
        </button>
      </form>

      {isLoading && reasoning && (
        <div className="p-4 bg-gf-gray-800/50 border border-gf-gray-700 rounded-lg">
          <h3 className="text-md font-semibold text-gf-gray-300 mb-2">AI is thinking...</h3>
          <pre className="text-sm text-gf-gray-400 whitespace-pre-wrap font-sans">{reasoning}</pre>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-gf-red bg-red-900/20 rounded-lg border border-red-800">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gf-gray-300 border-b border-gf-gray-700 pb-2">Matching Companies</h3>
            {results.map((result, index) => (
                <ResultCard key={index} result={result} />
            ))}
        </div>
      )}

      {!isLoading && !error && results.length === 0 && query && (
         <div className="text-center py-10 text-gf-gray-600">
            <p>No results found. Try rephrasing your query.</p>
        </div>
      )}

      {!isLoading && !error && results.length === 0 && !query && (
         <div className="text-center py-10 text-gf-gray-600">
            <p>Your search results will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AIScreener;
