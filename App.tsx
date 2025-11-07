import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import ResearchPanel from './components/ResearchPanel';
import { getInitialDashboardData, getStockData, getScreenerResults } from './services/geminiService';
import type { MarketIndex, StockData, NewsArticle, StockScreenerResult, LatestUpdate, MarketSummaryArticle, UpcomingEarning, SidebarData } from './types';

const App: React.FC = () => {
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [researchSummary, setResearchSummary] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<LatestUpdate[]>([]);
  const [marketSummaryArticle, setMarketSummaryArticle] = useState<MarketSummaryArticle | null>(null);
  const [upcomingEarnings, setUpcomingEarnings] = useState<UpcomingEarning[]>([]);
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTimeRange, setCurrentTimeRange] = useState('1M');

  // State for AI Screener
  const [screenerResults, setScreenerResults] = useState<StockScreenerResult[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [screenerError, setScreenerError] = useState<string | null>(null);
  const [screenerReasoning, setScreenerReasoning] = useState<string>('');
  const [searchingTicker, setSearchingTicker] = useState<string | null>(null);


  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Client-side caching to prevent hitting API rate limits during development/session.
      const CACHE_KEY = 'dashboardData';
      const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
      const cachedItem = sessionStorage.getItem(CACHE_KEY);

      if (cachedItem) {
        const { timestamp, data } = JSON.parse(cachedItem);
        if (new Date().getTime() - timestamp < CACHE_TTL) {
          console.log("Loading initial data from session cache.");
          setMarketIndices(data.marketIndices);
          setResearchSummary(data.researchSummary);
          setNewsArticles(data.newsArticles);
          setLatestUpdates(data.latestUpdates);
          setMarketSummaryArticle(data.marketSummaryArticle);
          setUpcomingEarnings(data.upcomingEarnings);
          setSidebarData(data.sidebarData);
          return; // Exit if cached data is valid
        }
      }

      console.log("Fetching fresh initial data from API.");
      const dashboardData = await getInitialDashboardData();

      setMarketIndices(dashboardData.marketIndices);
      setResearchSummary(dashboardData.researchSummary);
      setNewsArticles(dashboardData.newsArticles);
      setLatestUpdates(dashboardData.latestUpdates);
      setMarketSummaryArticle(dashboardData.marketSummaryArticle);
      setUpcomingEarnings(dashboardData.upcomingEarnings);
      setSidebarData(dashboardData.sidebarData);
      
      // Store fresh data in cache with a timestamp
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: new Date().getTime(),
        data: dashboardData
      }));

    } catch (err) {
      setError('Failed to fetch initial market data. The markets might be sleeping, or there was an API error.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    setSearchingTicker(query);
    setError(null);
    setStockData(null);
    const defaultTimeRange = '1M';
    setCurrentTimeRange(defaultTimeRange);
    try {
      const data = await getStockData(query, defaultTimeRange);
      setStockData(data);
    } catch (err) {
      setError(`Failed to fetch data for "${query}". Please check the ticker or company name.`);
      console.error(err);
    } finally {
      setIsSearching(false);
      setSearchingTicker(null);
    }
  };

  const handleScreenerSearch = async (query: string) => {
    if (!query) return;
    setIsScreening(true);
    setScreenerError(null);
    setScreenerResults([]);
    setScreenerReasoning('');
    try {
      const results = await getScreenerResults(query, (reasoningChunk) => {
        setScreenerReasoning(prev => prev + reasoningChunk);
      });
      setScreenerResults(results);
    } catch (err) {
      setScreenerError(`The AI screener failed to find results for your query. Please try rephrasing it.`);
      console.error(err);
    } finally {
      setIsScreening(false);
    }
  };

  const handleTimeRangeChange = async (newRange: string) => {
    if (!stockData) return;
    setIsSearching(true);
    setError(null);
    setCurrentTimeRange(newRange);
    try {
      // Create a new data object to avoid flickering while loading
      const optimisticStockData = { ...stockData, chartData: [] };
      setStockData(optimisticStockData);
      const data = await getStockData(stockData.ticker, newRange);
      setStockData(data);
    } catch (err) {
      setError(`Failed to fetch data for time range "${newRange}".`);
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }
  
  const resetToHome = () => {
    setStockData(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gf-dark font-sans">
      <Header onLogoClick={resetToHome} />
      <main className="mx-auto max-w-screen-2xl p-4 lg:p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-2">
            <LeftSidebar data={sidebarData} isLoading={isLoading} />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <MainContent 
              stockData={stockData} 
              isLoading={isSearching} 
              isInitialLoading={isLoading}
              error={error} 
              indices={marketIndices}
              onSearch={handleSearch}
              onTimeRangeChange={handleTimeRangeChange}
              selectedTimeRange={currentTimeRange}
              onGoBack={resetToHome}
              onScreenerSearch={handleScreenerSearch}
              screenerResults={screenerResults}
              isScreening={isScreening}
              screenerError={screenerError}
              screenerReasoning={screenerReasoning}
              searchingTicker={searchingTicker}
              latestUpdates={latestUpdates}
              marketSummaryArticle={marketSummaryArticle}
              upcomingEarnings={upcomingEarnings}
              newsArticles={newsArticles}
            />
          </div>
          <div className="hidden lg:block lg:col-span-3">
            <ResearchPanel summary={researchSummary} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;