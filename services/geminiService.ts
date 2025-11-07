
import { GoogleGenAI } from "@google/genai";
import type { MarketIndex, StockData, NewsArticle, StockScreenerResult } from '../types';

// IMPORTANT: This line assumes the API key is set in the environment.
// Do not edit this line.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A robust JSON parser that extracts the first complete JSON object or array 
 * from a string, ignoring any leading/trailing non-JSON text.
 * @param jsonString The string to parse.
 * @returns The parsed JSON object or array.
 */
const robustJsonParse = (jsonString: string): any => {
    // Attempt to find the first occurrence of a JSON object or array
    const jsonStart = jsonString.indexOf('{');
    const arrayStart = jsonString.indexOf('[');
    
    let start = -1;
    if (jsonStart !== -1 && arrayStart !== -1) {
      start = Math.min(jsonStart, arrayStart);
    } else if (jsonStart !== -1) {
      start = jsonStart;
    } else {
      start = arrayStart;
    }
  
    if (start === -1) {
      console.error("No JSON object or array found in the string:", jsonString);
      throw new Error("No JSON object or array found in the string.");
    }
    
    // Attempt to find the last occurrence of a JSON object or array
    const jsonEnd = jsonString.lastIndexOf('}');
    const arrayEnd = jsonString.lastIndexOf(']');
    const end = Math.max(jsonEnd, arrayEnd);

    if (end === -1) {
      console.error("Incomplete JSON structure:", jsonString);
      throw new Error("Incomplete JSON structure.");
    }

    const jsonSnippet = jsonString.substring(start, end + 1);

    try {
        return JSON.parse(jsonSnippet);
    } catch (e) {
        console.error("Failed to parse extracted JSON snippet:", jsonSnippet, e);
        // Fallback to parsing the whole string if snipping fails
        throw new Error("Failed to parse JSON response from API.");
    }
};

export const getMarketSummary = async (): Promise<MarketIndex[]> => {
  const prompt = `
Provide a real-time market summary for the following major US indices: Dow Jones, S&P 500, Nasdaq, Russell 2000, and VIX.
Use Google Search to get the latest data.
For each index, provide the name, current value, point change, percentage change, and an array of 20 plausible recent data points for a sparkline chart.

Return the data as a valid JSON array matching this structure:
[
  {
    "name": "string",
    "value": "string",
    "change": "string",
    "percentChange": "string",
    "isPositive": boolean,
    "chartData": [{ "value": number }]
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return robustJsonParse(response.text);
  } catch (error) {
    console.error("Error fetching or parsing market summary:", error);
    return [];
  }
};


export const getStockData = async (query: string, timeRange: string): Promise<StockData> => {
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
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
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

        return data;
    } catch (error) {
        console.error(`Error fetching or parsing stock data for ${query}:`, error);
        throw new Error(`Failed to get data for ${query}`);
    }
};


export const getResearchSummary = async (): Promise<string> => {
    const prompt = `
Act as a financial analyst. Provide a detailed but concise summary of "What's going on with the markets today?".
Use Google Search to get up-to-the-minute information.
Start with a 2-3 sentence overview.
Then, provide a bulleted list of 3-4 key takeaways from today's trading. Use a hyphen (-) for bullet points.
Format the response as a single block of text using markdown.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    return response.text;
}


export const getMarketNews = async (): Promise<NewsArticle[]> => {
    const prompt = `
Act as a financial news editor. Use Google Search to find the top 3 most important financial news stories right now.
For each story, provide a title, the source name (e.g., Bloomberg, Reuters), a 1-sentence summary, and the publication date as an ISO 8601 string.

Return the data as a valid JSON array matching this structure:
[
  {
    "title": "string",
    "source": "string",
    "summary": "string",
    "publicationDate": "string"
  }
]
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const parsedArticles = robustJsonParse(response.text);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // Combine the parsed articles with the grounding metadata to get URLs
        return parsedArticles.map((article: Omit<NewsArticle, 'url'>, index: number): NewsArticle => {
            const chunk = groundingChunks[index]?.web;
            return {
                ...article,
                url: chunk?.uri || '#',
                // Prefer the title from the search result for the source name
                source: chunk?.title || article.source,
            };
        });
    } catch (error) {
        console.error("Error fetching or parsing market news:", error);
        return [];
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
Do not include any text outside of the JSON array.
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
          if (chunk.thinkingResult) {
            onReasoningUpdate(chunk.thinkingResult.text);
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
