
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface StockChartProps {
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    // Generate mock chart data
    const generateChartData = () => {
      const basePrice = 175;
      const data = [];
      const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
      
      for (let i = 0; i < points; i++) {
        const price = basePrice + (Math.random() - 0.5) * 20 + Math.sin(i / 10) * 10;
        data.push({
          time: timeframe === '1D' 
            ? `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`
            : timeframe === '1W'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
            : `Day ${i + 1}`,
          price: price.toFixed(2),
          volume: Math.floor(Math.random() * 10000000) + 5000000
        });
      }
      return data;
    };

    setChartData(generateChartData());
  }, [symbol, timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-blue-400">
            Price: ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Timeframe Selector */}
      <div className="flex space-x-2">
        {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400 text-xs">Day High</p>
          <p className="text-white font-medium">$178.45</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400 text-xs">Day Low</p>
          <p className="text-white font-medium">$173.21</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400 text-xs">Avg Volume</p>
          <p className="text-white font-medium">45.6M</p>
        </div>
      </div>
    </div>
  );
};
