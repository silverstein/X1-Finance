
import React, { useState } from 'react';
import type { StockData, MarketIndex, StockScreenerResult, LatestUpdate, MarketSummaryArticle, UpcomingEarning, NewsArticle } from '../types';
import StockChart from './StockChart';
import LoadingSpinner from './LoadingSpinner';
import MarketOverview from './MarketOverview';
import AIScreener from './AIScreener';
import { SearchIcon, ArticleIcon } from './icons';

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
  // Home page content
  latestUpdates: LatestUpdate[];
  marketSummaryArticle: MarketSummaryArticle | null;
  upcomingEarnings: UpcomingEarning[];
  newsArticles: NewsArticle[];
}

const formatRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days <= 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
  });
};

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
    <div className="flex space-x-2 border-b border-gf-gray-700 pb-2">
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

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`mt-8 ${className}`}>
    <h2 className="text-xl font-semibold text-gf-gray-200 mb-4">{title}</h2>
    {children}
  </section>
);

const SectionLoadingSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-10 bg-gf-gray-800 rounded-md"></div>
    ))}
  </div>
);

const LatestUpdatesSection: React.FC<{ updates: LatestUpdate[]; isLoading: boolean }> = ({ updates, isLoading }) => (
  <Section title="Latest updates">
    {isLoading ? <SectionLoadingSkeleton count={4} /> : (
      <div className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 space-y-3">
        {updates.map((update, i) => (
          <div key={i} className="flex items-start text-sm border-b border-gf-gray-800 pb-3 last:border-b-0 last:pb-0">
            <span className="text-gf-gray-400 w-24 flex-shrink-0">{formatRelativeTime(update.timestamp)}</span>
            <span className="text-gf-gray-400 mr-2 uppercase text-xs font-bold w-32 truncate">{update.source}</span>
            <a href={update.url} target="_blank" rel="noopener noreferrer" className="text-gf-gray-200 hover:text-gf-blue hover:underline">
              {update.headline}
            </a>
          </div>
        ))}
      </div>
    )}
  </Section>
);

const USMarketSummarySection: React.FC<{ article: MarketSummaryArticle | null; isLoading: boolean }> = ({ article, isLoading }) => (
  <Section title="US market summary">
    {isLoading ? <SectionLoadingSkeleton count={3}/> : (
      <div className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800">
        <a href={article?.url} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="text-lg font-semibold text-gf-blue mb-2 hover:underline">{article?.headline}</h3>
        </a>
        <p className="text-sm text-gf-gray-300 leading-relaxed">{article?.content}</p>
      </div>
    )}
  </Section>
);

const UpcomingEarningsSection: React.FC<{ earnings: UpcomingEarning[]; isLoading: boolean }> = ({ earnings, isLoading }) => (
  <Section title="Upcoming earnings">
     {isLoading ? <SectionLoadingSkeleton count={4}/> : (
      <div className="bg-gf-gray-900 rounded-lg border border-gf-gray-800 divide-y divide-gf-gray-800">
        <div className="grid grid-cols-5 text-xs text-gf-gray-400 p-3 font-semibold uppercase tracking-wider">
          <div className="col-span-2">Company</div>
          <div>Period</div>
          <div>EPS Est.</div>
          <div>Rev Est.</div>
        </div>
        {earnings.map((earning) => (
          <div key={earning.ticker} className="grid grid-cols-5 text-sm p-3 hover:bg-gf-gray-800">
            <div className="col-span-2">
              <p className="font-semibold text-gf-gray-200">{earning.ticker}</p>
              <p className="text-xs text-gf-gray-400 truncate">{earning.companyName}</p>
            </div>
            <div className="text-gf-gray-300">{earning.period}</div>
            <div className="text-gf-gray-300">{earning.epsEstimate}</div>
            <div className="text-gf-gray-300">{earning.revenueEstimate}</div>
          </div>
        ))}
      </div>
    )}
  </Section>
);

const MoreNewsSection: React.FC<{ articles: NewsArticle[]; isLoading: boolean }> = ({ articles, isLoading }) => (
  <Section title="More news stories">
     {isLoading ? <SectionLoadingSkeleton count={5}/> : (
        <div className="space-y-4">
        {articles.map((article, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg border border-gf-gray-800 bg-gf-gray-900 hover:border-gf-gray-700 hover:bg-gf-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center text-xs text-gf-gray-400">
              <ArticleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="font-semibold uppercase tracking-wider truncate">{article.source}</span>
              <span className="mx-2">·</span>
              <span>{formatRelativeTime(article.publicationDate)}</span>
            </div>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block mt-1">
              <p className="font-semibold text-gf-blue text-sm leading-tight hover:underline">{article.title}</p>
            </a>
          </div>
        ))}
      </div>
     )}
  </Section>
);

const ChartSkeleton: React.FC = () => (
    <div className="w-full h-full bg-gf-gray-800 rounded-md animate-pulse" />
);

const MainContent: React.FC<MainContentProps> = (props) => {
  const { stockData, isLoading, isInitialLoading, error, indices, onSearch, onTimeRangeChange, selectedTimeRange, onGoBack, onScreenerSearch, screenerResults, isScreening, screenerError, screenerReasoning, searchingTicker, latestUpdates, marketSummaryArticle, upcomingEarnings, newsArticles } = props;
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
        <div className="h-96 bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 flex flex-col">
          <TimeRangeSelector selected={selectedTimeRange} onSelect={onTimeRangeChange} />
          <div className="flex-grow pt-4">
            {isLoading ? (
               <ChartSkeleton />
            ) : (
              <StockChart 
                data={stockData.chartData} 
                isPositive={stockData.isPositive}
                timeRange={selectedTimeRange}
              />
            )}
          </div>
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
            <LatestUpdatesSection updates={latestUpdates} isLoading={isInitialLoading} />
            <USMarketSummarySection article={marketSummaryArticle} isLoading={isInitialLoading} />
            <UpcomingEarningsSection earnings={upcomingEarnings} isLoading={isInitialLoading} />
            <MoreNewsSection articles={newsArticles} isLoading={isInitialLoading} />
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