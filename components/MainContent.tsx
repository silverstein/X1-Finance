
import React, { useState } from 'react';
import type { StockData, MarketIndex, StockScreenerResult } from '../types';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import MarketOverview from './MarketOverview';
import AIScreener from './AIScreener';
import { SearchIcon } from './icons';

interface MainContentProps {
  stockData: StockData | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  indices: MarketIndex[];
  onSearch: (query: string) => void;
  onTimeRangeChange: (range: string) => void;
  selectedTimeRange: string;
  onGoBack: () => void;
  // Screener Props
  onScreenerSearch: (query: string) => void;
  screenerResults: StockScreenerResult[];
  isScreening: boolean;
  screenerError: string | null;
  screenerReasoning: string;
  searchingTicker: string | null;
}

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gf-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stocks, ETFs, and more"
          className="w-full pl-11 pr-4 py-3 bg-gf-gray-800 border border-gf-gray-700 rounded-full text-gf-gray-200 placeholder-gf-gray-400 focus:outline-none focus:ring-2 focus:ring-gf-blue"
        />
      </form>
    </div>
  );
};

const TimeRangeSelector: React.FC<{ selected: string; onSelect: (range: string) => void }> = ({ selected, onSelect }) => {
  const ranges = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y'];
  return (
    <div className="flex space-x-2 border-b border-gf-gray-700 pb-2 mb-4">
      {ranges.map(range => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            selected === range
              ? 'bg-gf-blue/20 text-gf-blue'
              : 'text-gf-gray-300 hover:bg-gf-gray-700'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};


const StockDetail: React.FC<{ data: StockData }> = ({ data }) => {
  const textColor = data.isPositive ? 'text-gf-green' : 'text-gf-red';

  const StatRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-2 border-b border-gf-gray-800">
        <span className="text-gf-gray-400">{label}</span>
        <span className="font-medium text-gf-gray-200">{value}</span>
      </div>
    );
  };

  return (
    <div className="bg-gf-gray-900 p-6 rounded-lg border border-gf-gray-800">
      <div>
        <h2 className="text-2xl font-bold">{data.companyName} ({data.ticker})</h2>
        <p className="text-4xl font-bold mt-2">{data.price}</p>
        <div className={`flex items-baseline text-lg mt-1 ${textColor}`}>
          <span>{data.change}</span>
          <span className="ml-2">{`(${data.percentChange})`}</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm">
        <div>
          <StatRow label="Open" value={data.open} />
          <StatRow label="High" value={data.high} />
          <StatRow label="Low" value={data.low} />
        </div>
        <div>
          <StatRow label="Market Cap" value={data.marketCap} />
          <StatRow label="P/E Ratio" value={data.peRatio} />
          <StatRow label="Div Yield" value={data.dividendYield} />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gf-gray-800">
        <h3 className="text-md font-semibold text-gf-gray-300 mb-2">AI-Powered Analysis</h3>
        <p className="text-gf-gray-300 text-sm">{data.analysis}</p>
      </div>
    </div>
  );
};

const ContentTabs: React.FC<{ activeTab: string, onTabChange: (tab: string) => void }> = ({ activeTab, onTabChange }) => {
    const tabs = ['Market Overview', 'AI Deep Search'];
    return (
        <div className="mb-4 border-b border-gf-gray-700">
            <nav className="-mb-px flex space-x-6">
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab 
                            ? 'border-gf-blue text-gf-blue' 
                            : 'border-transparent text-gf-gray-400 hover:text-gf-gray-200 hover:border-gf-gray-600'
                        }`}>
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    )
}


const MainContent: React.FC<MainContentProps> = (props) => {
  const { stockData, isLoading, isInitialLoading, error, indices, onSearch, onTimeRangeChange, selectedTimeRange, onGoBack, onScreenerSearch, screenerResults, isScreening, screenerError, screenerReasoning, searchingTicker } = props;
  const [activeTab, setActiveTab] = useState('Market Overview');

  if (error) {
    return (
      <div className="text-center py-12 text-gf-red bg-red-900/20 rounded-lg border border-red-800">
        <p>{error}</p>
        <button onClick={onGoBack} className="mt-4 px-4 py-2 bg-gf-blue/20 text-gf-blue rounded-md hover:bg-gf-blue/30">
          Back to Market Overview
        </button>
      </div>
    );
  }
  
  if (stockData) {
    return (
      <div className="space-y-6">
        <button onClick={onGoBack} className="text-sm text-gf-blue hover:underline mb-2">
            ‹ Back to market overview
        </button>
        <StockDetail data={stockData} />
        <div className="h-96 bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800">
          <TimeRangeSelector selected={selectedTimeRange} onSelect={onTimeRangeChange} />
          {isLoading ? (
             <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
             </div>
          ) : (
            <StockChart 
              data={stockData.chartData} 
              isPositive={stockData.isPositive}
              timeRange={selectedTimeRange}
            />
          )}
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
        </div>
    );
  }

  return (
    <section>
        <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'Market Overview' && (
          <>
            <MarketOverview indices={indices} isLoading={isInitialLoading} />
            <SearchBar onSearch={onSearch} />
          </>
        )}
        {activeTab === 'AI Deep Search' && (
          <AIScreener
            onScreeningSearch={onScreenerSearch}
            results={screenerResults}
            isLoading={isScreening}
            error={screenerError}
            onResultClick={onSearch}
            reasoning={screenerReasoning}
            searchingTicker={searchingTicker}
          />
        )}
    </section>
  );
};

export default MainContent;
