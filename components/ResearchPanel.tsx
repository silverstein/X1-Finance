import React from 'react';

interface ResearchPanelProps {
  summary: string;
  isLoading: boolean;
}

const ResearchSkeleton: React.FC = () => (
    <div>
        <h2 className="text-lg font-semibold text-gf-gray-300 mb-4">Research</h2>
        <div className="animate-pulse space-y-4">
            <div className="space-y-3">
                <div className="h-4 bg-gf-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gf-gray-800 rounded w-5/6"></div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gf-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gf-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gf-gray-800 rounded w-3/4"></div>
            </div>
        </div>
    </div>
);

const ResearchPanel: React.FC<ResearchPanelProps> = ({ summary, isLoading }) => {
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
    <aside className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 sticky top-20">
      {isLoading ? (
        <ResearchSkeleton />
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gf-gray-300 mb-4">Research</h2>
          <div className="text-gf-gray-300 text-sm">
            {formattedSummary}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ResearchPanel;