import { GoogleGenAI, Type } from "@google/genai";
import type { StockData, StockScreenerResult } from '../types';

// IMPORTANT: This line assumes the API key is set in the environment.
// Do not edit this line.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

/**
 * Extracts a JSON object or array from a string that might be wrapped in markdown code blocks.
 * @param text The raw string response from the AI.
 * @returns A string containing only the JSON part.
 */
const extractJson = (text: string): string => {
  const trimmedText = text.trim();
  // Regex to find JSON content within ```json ... ``` or ``` ... ```
  const match = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  
  // If a markdown block is found, return its content.
  if (match && match[1]) {
    return match[1];
  }
  
  // Otherwise, assume the entire string is the JSON and return it.
  return trimmedText;
};

export const getInitialDashboardData = async () => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
Act as a comprehensive financial data provider. Use Google Search for the latest data.
Generate a single, valid JSON object for a financial dashboard homepage.
The JSON object must contain these top-level keys: "marketIndices", "researchSummary", "newsArticles", "latestUpdates", "marketSummaryArticle", "upcomingEarnings", "sidebarData".
- marketIndices: Array of 5 major world indices (e.g., Dow Jones, S&P 500, Nasdaq, FTSE 100, Nikkei 225). Each object in the array must have: "name" (string), "value" (string), "change" (string), "percentChange" (string), "isPositive" (boolean), and "chartData" (an array of exactly 20 objects, each with a single "value" key of type number, representing recent performance for a sparkline chart).
- researchSummary: A markdown string summarizing today's market.
- newsArticles: Array of 5 financial news stories. Each object must have: "title" (string), "source" (string), "summary" (string), "url" (string, a valid news URL), and "publicationDate" (string, ISO 8601 format).
- latestUpdates: Array of 5 recent market headlines. Each object must have: "source" (string), "headline" (string), "url" (string, a valid news URL), and "timestamp" (string, ISO 8601 format).
- marketSummaryArticle: Object with "headline" (string), "content" (string, a 2-paragraph summary), and "url" (string, a valid news URL for the summary).
- upcomingEarnings: Array of 4 companies reporting earnings soon. Each object must have: "ticker" (string), "companyName" (string), "date" (string), "epsEstimate" (string), "revenueEstimate" (string), and "period" (string, e.g., "Q2 2024").
- sidebarData: Object with a "watchlist" array (1 stock) and an "equitySectors" array (6 sectors).

Return ONLY the raw JSON object, without any markdown formatting, backticks, or other explanatory text.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const jsonText = extractJson(response.text);
        const data = JSON.parse(jsonText);

        return {
            marketIndices: data.marketIndices || [],
            researchSummary: data.researchSummary || 'Could not load market summary.',
            newsArticles: data.newsArticles || [],
            latestUpdates: data.latestUpdates || [],
            marketSummaryArticle: data.marketSummaryArticle || null,
            upcomingEarnings: data.upcomingEarnings || [],
            sidebarData: data.sidebarData || { watchlist: [], equitySectors: [] },
        };
    } catch (error) {
        console.error("Error fetching or parsing initial dashboard data:", error);
        throw error;
    }
};

export const getStockData = async (query: string, timeRange: string): Promise<StockData> => {
    const CACHE_KEY = `stockData-${query.toUpperCase()}-${timeRange}`;
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const cachedItem = sessionStorage.getItem(CACHE_KEY);
    if (cachedItem) {
        const { timestamp, data } = JSON.parse(cachedItem);
        if (new Date().getTime() - timestamp < CACHE_TTL) {
            console.log(`Loading stock data for ${query} (${timeRange}) from session cache.`);
            return data;
        }
    }
    
    console.log(`Fetching fresh stock data for ${query} (${timeRange}) from API.`);
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
Provide a detailed, real-time stock overview for "${query}". Use Google Search for the latest data for the specified time range: ${timeRange}.
Generate a single, valid JSON object with the following structure:
{
  "companyName": "string", "ticker": "string", "price": "string", "change": "string", "percentChange": "string", "isPositive": boolean, "marketCap": "string", "peRatio": "string", "dividendYield": "string", "open": "string", "high": "string", "low": "string",
  "analysis": "A 2-3 sentence AI-powered summary of the stock's recent performance and market outlook.",
  "chartData": [ { "dateTime": "ISO 8601 string", "price": number } ]
}
For the chartData:
- For '1D', provide intraday data points (every 5-15 minutes).
- For '5D' and longer, provide one closing price data point per day.
- Provide approximately 30-60 data points suitable for the "${timeRange}" range.

Return ONLY the raw JSON object, without any markdown formatting, backticks, or other explanatory text.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const jsonText = extractJson(response.text);
        const data: StockData = JSON.parse(jsonText);

        // Sort the chart data chronologically to ensure the chart is correct
        if (data.chartData && data.chartData.length > 0) {
            data.chartData.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        }

        // Store fresh data in cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: new Date().getTime(),
            data: data
        }));

        return data;
    } catch (error) {
        console.error(`Error fetching or parsing stock data for ${query}:`, error);
        throw new Error(`Failed to get data for ${query}`);
    }
};

export const getScreenerResults = async (query: string, onReasoningUpdate: (text: string) => void): Promise<StockScreenerResult[]> => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
Act as an expert financial analyst screening for stocks based on: "${query}".
Use Google Search to find up to 5 publicly traded companies that best match this request.
Generate a single, valid JSON array of objects, where each object has the following structure:
{
  "companyName": "string",
  "ticker": "string",
  "explanation": "A concise, 1-2 sentence explanation of why this company fits the criteria.",
  "metrics": [ { "name": "string", "value": "string" } ]
}
The "metrics" array should contain the key metrics the user asked for.

Return ONLY the raw JSON array, without any markdown formatting, backticks, or other explanatory text.
`;

    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 8192 }
            },
        });
        
        let fullResponseText = '';
        for await (const chunk of responseStream) {
          // FIX: The 'thinkingResult' property exists on streaming chunks but is not in the
          // default 'GenerateContentResponse' type from the SDK. Cast to 'any' to access it.
          if ((chunk as any).thinkingResult) {
            onReasoningUpdate((chunk as any).thinkingResult.text);
          }
          if (chunk.text) {
            fullResponseText += chunk.text;
          }
        }

        const jsonText = extractJson(fullResponseText);
        return JSON.parse(jsonText);
    } catch (error) {
        console.error(`Error fetching or parsing screener results for query "${query}":`, error);
        throw new Error(`Failed to get screener results for "${query}"`);
    }
}