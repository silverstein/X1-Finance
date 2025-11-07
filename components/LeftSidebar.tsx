
import React from 'react';
import { ArrowDownIcon, ChartIcon, ListIcon } from './icons';

const LeftSidebar: React.FC = () => {
  const equitySectors = [
    { name: 'Materials', value: '900.86', change: '-0.53%', isPositive: false },
    { name: 'Communications', value: '586.94', change: '-0.94%', isPositive: false },
    { name: 'Energy', value: '927.62', change: '+0.94%', isPositive: true },
    { name: 'Industrials', value: '1,538.39', change: '-0.41%', isPositive: false },
    { name: 'Financials', value: '645.67', change: '-0.32%', isPositive: false },
    { name: 'Technology', value: '2,910.77', change: '-2.07%', isPositive: false },
  ];

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
        <div className="bg-gf-gray-900 p-3 rounded-lg border border-gf-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gf-gray-100">BRK.A</p>
              <p className="text-xs text-gf-gray-400">Berkshire Hathaw...</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gf-gray-100">$739,900.00</p>
              <p className="text-sm text-gf-green">+0.51%</p>
            </div>
          </div>
        </div>
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
