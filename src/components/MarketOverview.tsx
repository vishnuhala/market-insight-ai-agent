
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

interface MarketOverviewProps {
  onCompanySelect: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onCompanySelect }) => {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.84,
      change: 2.34,
      changePercent: 1.35,
      volume: 45678900,
      marketCap: '2.8T'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.21,
      change: -1.45,
      changePercent: -1.04,
      volume: 23456789,
      marketCap: '1.7T'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.85,
      change: 4.23,
      changePercent: 1.13,
      volume: 34567890,
      marketCap: '2.9T'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.50,
      change: -8.34,
      changePercent: -3.25,
      volume: 67890123,
      marketCap: '789B'
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 875.30,
      change: 15.67,
      changePercent: 1.82,
      volume: 45123678,
      marketCap: '2.1T'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 145.86,
      change: 0.92,
      changePercent: 0.63,
      volume: 28901234,
      marketCap: '1.5T'
    }
  ]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    return `${(volume / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-blue-400" />
            <span>Market Overview</span>
            <Badge className="bg-green-500/20 text-green-400">Live Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-sm">S&P 500</p>
              <p className="text-2xl font-bold text-white">4,567.89</p>
              <p className="text-green-400 text-sm">+1.24%</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-sm">NASDAQ</p>
              <p className="text-2xl font-bold text-white">14,234.56</p>
              <p className="text-green-400 text-sm">+0.87%</p>
            </div>
            <div className="text-center p-4 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-sm">DOW</p>
              <p className="text-2xl font-bold text-white">35,678.90</p>
              <p className="text-red-400 text-sm">-0.43%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Stocks */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Top Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => onCompanySelect(stock.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-bold text-white">{stock.symbol}</h3>
                        <p className="text-slate-400 text-sm">{stock.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">
                      ${formatNumber(stock.price)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stock.change >= 0 ? '+' : ''}
                        {formatNumber(stock.change)} ({formatNumber(stock.changePercent)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-slate-400 text-xs mt-2">
                  <span>Vol: {formatVolume(stock.volume)}</span>
                  <span>Cap: {stock.marketCap}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
