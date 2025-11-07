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
