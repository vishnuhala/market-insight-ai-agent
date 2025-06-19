
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface StockChartProps {
  symbol: string;
  currentPrice?: number;
}

export const StockChart: React.FC<StockChartProps> = ({ symbol, currentPrice }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1D');

  useEffect(() => {
    console.log(`Generating chart data for ${symbol} with current price ${currentPrice}`);
    
    // Generate realistic chart data based on current price
    const generateChartData = () => {
      const basePrice = currentPrice || 100;
      const data = [];
      const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
      
      // Determine volatility based on symbol and current market conditions
      let volatility = 0.025; // default
      
      if (symbol.includes('.BSE') || symbol.includes('.NSE')) {
        volatility = 0.035; // Indian stocks tend to be more volatile
      }
      
      if (symbol.includes('CRYPTO') || symbol.toLowerCase().includes('bitcoin')) {
        volatility = 0.08; // Crypto is highly volatile
      }
      
      let currentPricePoint = basePrice;
      
      // Generate historical data working backwards from current price
      for (let i = points - 1; i >= 0; i--) {
        const isCurrentPoint = i === points - 1;
        
        if (isCurrentPoint) {
          // Use actual current price for the latest point
          currentPricePoint = basePrice;
        } else {
          // Generate realistic historical movement
          const trend = timeframe === '1Y' ? Math.sin(i / 50) * 0.002 : Math.sin(i / 10) * 0.001;
          const randomChange = (Math.random() - 0.5) * volatility * 2;
          const priceChange = trend + randomChange;
          
          currentPricePoint = currentPricePoint * (1 - priceChange);
        }
        
        data.unshift({
          time: timeframe === '1D' 
            ? `${9 + Math.floor((points - 1 - i) / 2)}:${(points - 1 - i) % 2 === 0 ? '00' : '30'}`
            : timeframe === '1W'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][points - 1 - i] || `Day ${points - i}`
            : timeframe === '1M'
            ? `${points - i}`
            : timeframe === '3M'
            ? `Day ${points - i}`
            : `${Math.floor((points - i) / 30) + 1}M`,
          price: currentPricePoint.toFixed(2),
          volume: Math.floor(Math.random() * 10000000) + 1000000
        });
      }
      
      return data;
    };

    setChartData(generateChartData());
  }, [symbol, timeframe, currentPrice]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-blue-400">
            Price: ${payload[0].value}
          </p>
          <p className="text-slate-400 text-sm">
            {symbol}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate dynamic stats from chart data
  const calculateStats = () => {
    if (chartData.length === 0) return { high: 0, low: 0, volume: 0 };
    
    const prices = chartData.map(d => parseFloat(d.price));
    const volumes = chartData.map(d => d.volume);
    
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: volumes.reduce((acc, vol) => acc + vol, 0) / volumes.length
    };
  };

  const stats = calculateStats();

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
          <p className="text-slate-400 text-xs">{timeframe} High</p>
          <p className="text-white font-medium">${stats.high.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400 text-xs">{timeframe} Low</p>
          <p className="text-white font-medium">${stats.low.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400 text-xs">Avg Volume</p>
          <p className="text-white font-medium">{(stats.volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  );
};
