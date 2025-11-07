import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { NewsArticle } from '../types';
import { ArticleIcon } from './icons';

interface ResearchPanelProps {
  summary: string;
  news: NewsArticle[];
  isLoading: boolean;
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

const ResearchPanel: React.FC<ResearchPanelProps> = ({ summary, news, isLoading }) => {
  const formattedSummary = summary
    .split('\n')
    .map((line, index) => {
      // The original regex required a space after the bullet, which failed if the AI omitted it.
      // This updated regex makes the space optional, correctly parsing both "* item" and "*item".
      const bulletMatch = line.match(/^[\*\-]\s*(.*)/);
      if (bulletMatch) {
        return <li key={index} className="mb-2">{bulletMatch[1]}</li>;
      }
      if (line.trim() === '') return null; // Ignore empty lines
      return <p key={index} className="mb-4">{line}</p>;
    })
    .filter(Boolean) // Remove nulls from empty lines
    .reduce((acc: React.ReactElement[], el: React.ReactElement) => {
      if (el.type === 'li') {
        const last = acc[acc.length - 1];
        if (last && last.type === 'ul') {
          // FIX: Cast `last.props` to access the `children` property and fix the TypeScript error.
          const newUl = React.cloneElement(last, {}, [...React.Children.toArray((last.props as { children?: React.ReactNode }).children), el]);
          return [...acc.slice(0, -1), newUl];
        } else {
          return [...acc, <ul key={`ul-${acc.length}`} className="list-disc pl-5 space-y-1">{el}</ul>];
        }
      }
      return [...acc, el];
    }, [] as React.ReactElement[]);

  return (
    <aside className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gf-gray-300 mb-4">Research</h2>
            <div className="text-gf-gray-300 text-sm">
              {formattedSummary}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gf-gray-300 mb-4">Recent News</h2>
            <div className="space-y-4">
              {news.map((article, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg border border-transparent hover:border-gf-gray-700 hover:bg-gf-gray-800 transition-all duration-200"
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
                  <p className="text-sm text-gf-gray-300 mt-2">{article.summary}</p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-gf-blue hover:underline mt-3 inline-block font-medium"
                  >
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default ResearchPanel;