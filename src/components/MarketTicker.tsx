
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const MarketTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52 },
    { symbol: 'NASDAQ', price: 14234.56, change: -45.23, changePercent: -0.32 },
    { symbol: 'DOW', price: 35678.90, change: 156.78, changePercent: 0.44 },
    { symbol: 'AAPL', price: 175.84, change: 2.34, changePercent: 1.35 },
    { symbol: 'MSFT', price: 378.85, change: 4.23, changePercent: 1.13 },
    { symbol: 'GOOGL', price: 138.21, change: -1.45, changePercent: -1.04 },
    { symbol: 'TSLA', price: 248.50, change: -8.34, changePercent: -3.25 },
    { symbol: 'NVDA', price: 875.30, change: 15.67, changePercent: 1.82 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 2,
        change: item.change + (Math.random() - 0.5) * 0.5,
        changePercent: item.changePercent + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 border-b border-slate-700 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll space-x-8 py-2">
          {[...tickerData, ...tickerData].map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-white font-medium">{item.symbol}</span>
              <span className="text-slate-300">${item.price.toFixed(2)}</span>
              <div className="flex items-center space-x-1">
                {item.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
