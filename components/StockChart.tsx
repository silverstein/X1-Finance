import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  dateTime: string;
  price: number;
}

interface StockChartProps {
  data: ChartDataPoint[];
  isPositive: boolean;
  timeRange: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label, timeRange }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const price = payload[0].value;
      
      const formatOptions: Intl.DateTimeFormatOptions = timeRange === '1D'
        ? { hour: 'numeric', minute: '2-digit' }
        : { month: 'short', day: 'numeric', year: 'numeric' };

      const formattedLabel = date.toLocaleString('en-US', formatOptions);

      return (
        <div className="bg-gf-gray-800 p-2 border border-gf-gray-700 rounded-md shadow-lg">
          <p className="label text-gf-gray-300">{formattedLabel}</p>
          <p className="intro text-gf-blue">{`Price : $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
  
    return null;
  };
  

const StockChart: React.FC<StockChartProps> = ({ data, isPositive, timeRange }) => {
    const strokeColor = isPositive ? '#81c995' : '#f28b82';
    const gradientId = isPositive ? 'chartGradientGreen' : 'chartGradientRed';

    const tickFormatter = (tick: string): string => {
        const date = new Date(tick);
        if (timeRange === '1D') {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#81c995" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#81c995" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="chartGradientRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f28b82" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#f28b82" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3c4043" />
        <XAxis 
          dataKey="dateTime" 
          tick={{ fill: '#9aa0a6', fontSize: 12 }} 
          stroke="#3c4043"
          tickFormatter={tickFormatter}
        />
        <YAxis 
          tick={{ fill: '#9aa0a6', fontSize: 12 }} 
          stroke="#3c4043"
          domain={['dataMin - 5', 'dataMax + 5']}
          tickFormatter={(tick) => `$${Math.round(tick)}`}
        />
        <Tooltip content={<CustomTooltip timeRange={timeRange} />} />
        <Area type="monotone" dataKey="price" stroke={strokeColor} fill={`url(#${gradientId})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockChart;