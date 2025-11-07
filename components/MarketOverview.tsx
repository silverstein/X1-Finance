
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { MarketIndex } from '../types';
import LoadingSpinner from './LoadingSpinner';

const SparklineChart: React.FC<{ data: { value: number }[]; isPositive: boolean }> = ({ data, isPositive }) => {
  const strokeColor = isPositive ? '#81c995' : '#f28b82';
  return (
    <div className="h-12 w-24 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={strokeColor} fill={`url(#color-${isPositive})`} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};


const MarketIndexCard: React.FC<{ index: MarketIndex }> = ({ index }) => {
  const textColor = index.isPositive ? 'text-gf-green' : 'text-gf-red';
  const changeSymbol = index.isPositive ? '▲' : '▼';

  return (
    <div className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 flex-1">
      <h3 className="text-sm text-gf-gray-400">{index.name}</h3>
      <div className="flex justify-between items-end mt-1">
        <div>
          <p className="text-2xl font-medium">{index.value}</p>
          <div className={`flex items-baseline text-sm mt-1 ${textColor}`}>
            <span>{index.change}</span>
            <span className="ml-2">{`(${index.percentChange})`}</span>
          </div>
        </div>
        <SparklineChart data={index.chartData} isPositive={index.isPositive} />
      </div>
    </div>
  );
};

const MarketOverview: React.FC<{ indices: MarketIndex[]; isLoading: boolean }> = ({ indices, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gf-gray-900 p-4 rounded-lg border border-gf-gray-800 h-28 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!indices || indices.length === 0) {
    return (
      <div className="text-center py-8 text-gf-gray-400">
        Market data is currently unavailable.
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {indices.map((index) => (
          <MarketIndexCard key={index.name} index={index} />
        ))}
      </div>
    </section>
  );
};

export default MarketOverview;
