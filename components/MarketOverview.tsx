
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import type { MarketIndex } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ArrowUp, ArrowDown } from './icons';

const SparklineChart: React.FC<{ data: { value: number }[]; isPositive: boolean }> = ({ data, isPositive }) => {
  const strokeColor = isPositive ? '#81c995' : '#f28b82';
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`color-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide={true} />
          <Area type="monotone" dataKey="value" stroke={strokeColor} fill={`url(#color-${isPositive})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChangeIndicator: React.FC<{ isPositive: boolean; percentChange: string }> = ({ isPositive, percentChange }) => {
    const bgColor = isPositive ? 'bg-gf-green' : 'bg-gf-red';
    const textColor = isPositive ? 'text-gf-green' : 'text-gf-red';
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
        <div className={`flex items-center space-x-2`}>
            <span className={`text-lg font-bold ${textColor}`}>{percentChange}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${bgColor}`}>
                <Icon className="w-3.5 h-3.5 text-white" strokeWidth="3" />
            </div>
        </div>
    );
};


const MarketIndexCard: React.FC<{ index: MarketIndex }> = ({ index }) => {
  return (
    <div className="bg-gf-gray-900 p-4 rounded-xl border border-gf-gray-800 flex flex-col h-52">
      {/* Top Section */}
      <div className="flex-shrink-0">
        <h3 className="text-xl font-semibold text-gf-gray-200">{index.name}</h3>
        <p className="text-md text-gf-gray-300 mt-2">{index.value}</p>
        <p className="text-sm text-gf-gray-400">{index.change}</p>
        <div className="mt-3">
            <ChangeIndicator isPositive={index.isPositive} percentChange={index.percentChange} />
        </div>
      </div>
      
      {/* Spacer and Dotted Line */}
      <div className="flex-grow"></div>
      <div className="h-px my-3 bg-repeat-x" style={{
        backgroundImage: `radial-gradient(circle at center, #5f6368 1px, transparent 1.5px)`,
        backgroundSize: '8px 100%'
      }}></div>

      {/* Chart Section */}
      <div className="h-16 -mx-4 -mb-4">
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
          <div key={i} className="bg-gf-gray-900 p-4 rounded-xl border border-gf-gray-800 h-52 animate-pulse"></div>
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
