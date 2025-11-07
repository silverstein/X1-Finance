import React from 'react';
import { ArrowDownIcon, ChartIcon, ListIcon } from './icons';
import type { SidebarData } from '../types';

interface LeftSidebarProps {
  data: SidebarData | null;
  isLoading: boolean;
}

const SidebarSkeleton: React.FC = () => (
  <aside className="space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gf-gray-800 rounded w-24"></div>
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 bg-gf-gray-800 rounded-full"></div>
        <div className="h-6 w-6 bg-gf-gray-800 rounded-full"></div>
      </div>
    </div>
    <div>
      <div className="h-4 bg-gf-gray-800 rounded w-1/3 mb-2"></div>
      <div className="h-16 bg-gf-gray-900 p-3 rounded-lg border border-gf-gray-800"></div>
    </div>
    <div>
      <div className="h-4 bg-gf-gray-800 rounded w-1/2 mb-2"></div>
      <div className="space-y-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-gf-gray-900 p-3 rounded-lg border border-gf-gray-800"></div>
        ))}
      </div>
    </div>
  </aside>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <SidebarSkeleton />;
  }
  
  if (!data) {
    return null; // Or a placeholder/error state
  }

  const { watchlist, equitySectors } = data;

  return (
    <aside className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gf-gray-200 flex items-center">
          Lists <ArrowDownIcon className="ml-2" />
        </h2>
        <div className="flex items-center space-x-2 text-gf-gray-400">
          <button><ChartIcon /></button>
          <button><ListIcon /></button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gf-gray-300 mb-2">Watchlist</h3>
        {watchlist.map(item => (
          <div key={item.ticker} className="bg-gf-gray-900 p-3 rounded-lg border border-gf-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gf-gray-100">{item.ticker}</p>
                <p className="text-xs text-gf-gray-400 truncate">{item.companyName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gf-gray-100">{item.price}</p>
                <p className={`text-sm ${item.isPositive ? 'text-gf-green' : 'text-gf-red'}`}>
                  {item.changePercent}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gf-gray-300 mb-2">Equity sectors</h3>
        <div className="space-y-1">
          {equitySectors.map(sector => (
            <div key={sector.name} className="bg-gf-gray-900 p-3 rounded-lg border border-gf-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gf-gray-100">{sector.name}</p>
                  <p className="text-xs text-gf-gray-400">{sector.value}</p>
                </div>
                <p className={`text-sm ${sector.isPositive ? 'text-gf-green' : 'text-gf-red'}`}>
                  {sector.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;