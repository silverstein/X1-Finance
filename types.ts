export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  percentChange: string;
  isPositive: boolean;
  chartData: { value: number }[];
}

export interface StockData {
  companyName: string;

  ticker: string;
  price: string;
  change: string;
  percentChange: string;
  isPositive: boolean;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  analysis: string;
  chartData: { dateTime: string; price: number }[];
  open?: string;
  high?: string;
  low?: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  summary: string;
  url: string;
  publicationDate: string;
}

export interface ScreenerMetric {
  name: string;
  value: string;
}

export interface StockScreenerResult {
  companyName: string;
  ticker: string;
  explanation: string;
  metrics: ScreenerMetric[];
}

// New types for the enhanced home page
export interface LatestUpdate {
  source: string;
  headline: string;
  url: string;
  timestamp: string;
}

export interface MarketSummaryArticle {
  headline: string;
  content: string;
  url: string;
}

export interface UpcomingEarning {
  ticker: string;
  companyName: string;
  date: string;
  epsEstimate: string;
  revenueEstimate: string;
  period: string;
}

// New types for dynamic sidebar
export interface WatchlistItem {
  ticker: string;
  companyName: string;
  price: string;
  changePercent: string;
  isPositive: boolean;
}

export interface EquitySector {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface SidebarData {
    watchlist: WatchlistItem[];
    equitySectors: EquitySector[];
}