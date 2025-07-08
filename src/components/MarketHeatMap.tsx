
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface HeatMapStock {
  symbol: string;
  name: string;
  change: number;
  marketCap: number;
}

export const MarketHeatMap: React.FC = () => {
  const [stocks] = useState<HeatMapStock[]>([
    { symbol: 'AAPL', name: 'Apple', change: 2.34, marketCap: 2800 },
    { symbol: 'MSFT', name: 'Microsoft', change: 1.23, marketCap: 2900 },
    { symbol: 'GOOGL', name: 'Alphabet', change: -0.87, marketCap: 1700 },
    { symbol: 'AMZN', name: 'Amazon', change: 0.92, marketCap: 1500 },
    { symbol: 'TSLA', name: 'Tesla', change: -3.25, marketCap: 789 },
    { symbol: 'NVDA', name: 'NVIDIA', change: 4.67, marketCap: 2100 },
    { symbol: 'META', name: 'Meta', change: 1.89, marketCap: 890 },
    { symbol: 'NFLX', name: 'Netflix', change: -1.45, marketCap: 180 },
    { symbol: 'ORCL', name: 'Oracle', change: 0.67, marketCap: 340 },
    { symbol: 'CRM', name: 'Salesforce', change: 2.11, marketCap: 250 },
    { symbol: 'ADBE', name: 'Adobe', change: -0.98, marketCap: 280 },
    { symbol: 'INTC', name: 'Intel', change: 1.34, marketCap: 200 }
  ]);

  const getHeatMapColor = (change: number): string => {
    const intensity = Math.min(Math.abs(change) / 5, 1);
    if (change > 0) {
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`;
    } else {
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`;
    }
  };

  const getSize = (marketCap: number): string => {
    if (marketCap > 2000) return 'col-span-3 row-span-2';
    if (marketCap > 1000) return 'col-span-2 row-span-2';
    if (marketCap > 500) return 'col-span-2';
    return '';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span>Market Heat Map</span>
          </div>
          <div className="flex items-center text-xs text-slate-400 space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500/60 rounded"></div>
              <span>Gains</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500/60 rounded"></div>
              <span>Losses</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2 min-h-[300px]">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className={`relative rounded-lg p-3 cursor-pointer hover:scale-105 transform transition-all duration-300 ${getSize(stock.marketCap)} flex flex-col justify-between border border-slate-600/30 hover:border-slate-500/50`}
              style={{ 
                backgroundColor: getHeatMapColor(stock.change),
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">{stock.symbol}</div>
                <div className="text-xs text-slate-200/80 truncate">{stock.name}</div>
                <div className="text-xs text-slate-300/60">${stock.marketCap}B</div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  {stock.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-300" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-300" />
                  )}
                </div>
                <span className={`text-xs font-bold ${
                  stock.change > 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 p-3 bg-slate-900/40 rounded-lg">
          <p className="text-slate-400 text-xs text-center">
            Size represents market cap • Color intensity shows performance magnitude
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
