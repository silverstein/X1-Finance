import { GoogleGenAI } from "@google/genai";
import type { MarketIndex, StockData, NewsArticle, StockScreenerResult, SidebarData } from '../types';

// IMPORTANT: This line assumes the API key is set in the environment.
// Do not edit this line.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A robust JSON parser that handles extraneous text and markdown from the API.
 * It finds and parses the first complete JSON object or array in a string,
 * correctly handling special characters and brackets inside string values.
 * @param text The string to parse.
 * @returns The parsed JSON object or array.
 */
const robustJsonParse = (text: string): any => {
    // 1. First, try to find a JSON blob within a markdown code block
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let contentToParse = markdownMatch ? markdownMatch[1] : text;
    contentToParse = contentToParse.trim();

    try {
        // First attempt: try parsing the content directly. This is the cleanest path.
        return JSON.parse(contentToParse);
    } catch (e) {
        console.warn("Direct JSON parsing failed. Attempting to extract and parse a snippet.", e);
    }
    
    // 2. If direct parsing fails, find the first '{' or '['
    const jsonStart = contentToParse.indexOf('{');
    const arrayStart = contentToParse.indexOf('[');
    
    let start = -1;
    if (jsonStart !== -1 && (arrayStart === -1 || jsonStart < arrayStart)) {
        start = jsonStart;
    } else if (arrayStart !== -1) {
        start = arrayStart;
    }

    if (start === -1) {
        throw new Error("No JSON object or array found in the string.");
    }
    
    // 3. Find the matching closing bracket, accounting for nesting, strings, and escaped characters.
    const startChar = contentToParse[start];
    const endChar = startChar === '{' ? '}' : ']';
    let openBrackets = 0;
    let end = -1;
    let inString = false;
    let isEscaping = false;

    for (let i = start; i < contentToParse.length; i++) {
        const char = contentToParse[i];
        
        if (isEscaping) {
            isEscaping = false;
            continue;
        }
        
        if (char === '\\') {
            isEscaping = true;
            continue;
        }
        
        if (char === '"') {
            inString = !inString;
        }
        
        if (!inString) {
            if (char === startChar) {
                openBrackets++;
            } else if (char === endChar) {
                openBrackets--;
            }
        }
        
        if (openBrackets === 0 && !inString) {
            end = i;
            break;
        }
    }

    if (end === -1) {
        throw new Error("Incomplete JSON structure found in the string.");
    }

    const jsonSnippet = contentToParse.substring(start, end + 1);

    try {
        return JSON.parse(jsonSnippet);
    } catch (e) {
        console.error("Failed to parse extracted JSON snippet:", jsonSnippet, e);
        throw new Error("Failed to parse JSON response from API.");
    }
};

export const getInitialDashboardData = async () => {
    const prompt = `
Act as a comprehensive financial data provider and analyst. Use Google Search to get the latest, most accurate data for all requests.

Provide a complete set of data for a financial dashboard homepage in a single JSON object. The JSON object must contain the following top-level keys: "marketIndices", "researchSummary", "newsArticles", "latestUpdates", "marketSummaryArticle", "upcomingEarnings", and "sidebarData".

1.  **marketIndices**: A real-time market summary for Dow Jones, S&P 500, Nasdaq, Russell 2000, and VIX. For each index, provide name, current value, point change, percentage change, and an array of 20 volatile data points for a sparkline chart.
2.  **researchSummary**: A detailed but concise analyst summary of "What's going on with the markets today?". Start with a 2-3 sentence overview, then a bulleted list of 3-4 key takeaways. Format this as a single markdown string.
3.  **newsArticles**: The top 5 most important financial news stories. For each, provide a title, the source name, a 1-sentence summary, the publication date as an ISO 8601 string, and the direct URL to the article.
4.  **latestUpdates**: 5 of the most recent, breaking single-sentence market headlines. For each, provide the source, the headline, the publication timestamp as an ISO 8601 string, and the direct URL to the article.
5.  **marketSummaryArticle**: A 2-paragraph summary of the current day's US stock market performance, including a catchy headline.
6.  **upcomingEarnings**: 4 significant companies reporting earnings in the upcoming week. For each, provide its ticker, company name, report date, fiscal period, consensus EPS estimate, and consensus revenue estimate.
7.  **sidebarData**: Data for the sidebar. It must contain two keys: "watchlist" and "equitySectors".
    *   **watchlist**: Get data for one major, well-known company stock (like Apple, Microsoft, or Google). Provide its ticker, a shortened company name, current price, percentage change, and whether the change is positive.
    *   **equitySectors**: Get the current performance for 6 major US equity sectors (e.g., Technology, Health Care, Energy). For each sector, provide its name, a representative value, percentage change, and whether the change is positive.

Return the data as a single valid JSON object matching this structure:
{
  "marketIndices": [
    { "name": "string", "value": "string", "change": "string", "percentChange": "string", "isPositive": boolean, "chartData": [{ "value": number }] }
  ],
  "researchSummary": "string (markdown formatted)",
  "newsArticles": [
    { "title": "string", "source": "string", "summary": "string", "publicationDate": "string", "url": "string" }
  ],
  "latestUpdates": [
    { "source": "string", "headline": "string", "timestamp": "string", "url": "string" }
  ],
  "marketSummaryArticle": {
    "headline": "string",
    "content": "string"
  },
  "upcomingEarnings": [
    { "ticker": "string", "companyName": "string", "date": "string", "period": "string", "epsEstimate": "string", "revenueEstimate": "string" }
  ],
  "sidebarData": {
    "watchlist": [
      { "ticker": "string", "companyName": "string", "price": "string", "changePercent": "string", "isPositive": boolean }
    ],
    "equitySectors": [
      { "name": "string", "value": "string", "change": "string", "isPositive": boolean }
    ]
  }
}
IMPORTANT: The entire response must be only the single, final JSON object. Do not include any text, explanations, or markdown formatting outside of it.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const data = robustJsonParse(response.text);

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
    
    const prompt = `
Provide a detailed, real-time stock overview for "${query}". Use Google Search to get the latest, most accurate data.
Provide historical price data for the specified time range: ${timeRange}.

The data must be accurate and directly correspond to the requested time frame.
- For a '1D' time range, provide intraday data points (e.g., every 5-15 minutes) for the most recent trading day.
- For time ranges of '5D' and longer, provide one data point representing the closing price for each trading day in that period.

Provide an array of approximately 30-60 data points suitable for the "${timeRange}" time range.
The "dateTime" property must be a valid ISO 8601 timestamp string.
Include a 2-3 sentence AI-powered summary of the stock's recent performance and market outlook.

Return the data as a single valid JSON object matching this structure:
{
  "companyName": "string",
  "ticker": "string",
  "price": "string",
  "change": "string",
  "percentChange": "string",
  "isPositive": boolean,
  "marketCap": "string",
  "peRatio": "string",
  "dividendYield": "string",
  "open": "string",
  "high": "string",
  "low": "string",
  "analysis": "string",
  "chartData": [{ "dateTime": "string", "price": number }]
}
IMPORTANT: Do not include any text, explanations, or markdown formatting outside of the final JSON object. The entire response must be only the JSON data.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const data: StockData = robustJsonParse(response.text);

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
    const prompt = `
Act as an expert financial analyst. The user wants to screen for stocks based on the following criteria: "${query}".
Use Google Search to find up to 5 publicly traded companies that best match this request.
For each company, provide:
1.  The company name and its ticker symbol.
2.  An array of the key metrics the user asked for (e.g., P/E Ratio, Dividend Yield, Market Cap).
3.  A concise, 1-2 sentence explanation of why this company fits the user's criteria.

Return the data as a single valid JSON array matching this structure:
[
  {
    "companyName": "string",
    "ticker": "string",
    "explanation": "string",
    "metrics": [{ "name": "string", "value": "string" }]
  }
]
IMPORTANT: Do not include any text, explanations, or markdown formatting outside of the final JSON array. The entire response must be only the JSON data.
`;

    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
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

        return robustJsonParse(fullResponseText);
    } catch (error) {
        console.error(`Error fetching or parsing screener results for query "${query}":`, error);
        throw new Error(`Failed to get screener results for "${query}"`);
    }
}