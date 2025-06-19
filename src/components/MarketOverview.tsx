
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [rateLimitHit, setRateLimitHit] = useState(false);

  // Get API key from localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('stockApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Listen for API key updates
  useEffect(() => {
    const handleStorageChange = () => {
      const newApiKey = localStorage.getItem('stockApiKey');
      if (newApiKey) {
        setApiKey(newApiKey);
        setRateLimitHit(false); // Reset rate limit when new API key is added
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper function to get approximate market cap
  const getMarketCap = (symbol: string): string => {
    const marketCaps: { [key: string]: string } = {
      'AAPL': '2.8T',
      'GOOGL': '1.7T',
      'MSFT': '2.9T',
      'TSLA': '789B',
      'NVDA': '2.1T',
      'AMZN': '1.5T'
    };
    return marketCaps[symbol] || 'N/A';
  };

  // Fetch real stock data with rate limiting detection
  const fetchStockData = async (symbol: string, name: string) => {
    if (!apiKey || rateLimitHit) {
      return null;
    }

    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
      const data = await response.json();
      
      console.log(`Fetching data for ${symbol}:`, data);

      // Check for rate limit
      if (data['Information'] && data['Information'].includes('rate limit')) {
        console.log('Rate limit detected');
        setRateLimitHit(true);
        toast.error("API Rate Limit Reached", {
          description: "Using cached data. Upgrade your Alpha Vantage plan for more requests."
        });
        return null;
      }

      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol,
          name,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          marketCap: getMarketCap(symbol)
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  // Load initial stock data
  const loadStocks = async (showToast: boolean = true) => {
    if (!apiKey) {
      // Use fallback data when no API key
      setStocks([
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
      setIsLoading(false);
      return;
    }

    if (rateLimitHit) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const companies = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corp.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' }
    ];

    try {
      // Fetch stocks one by one with delay to avoid overwhelming the API
      const validStocks: Stock[] = [];
      
      for (const company of companies) {
        if (rateLimitHit) break; // Stop if rate limit is hit
        
        const stockData = await fetchStockData(company.symbol, company.name);
        if (stockData) {
          validStocks.push(stockData);
        }
        
        // Add delay between requests to be respectful to the API
        if (validStocks.length < companies.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (validStocks.length > 0) {
        setStocks(validStocks);
        setLastRefresh(new Date());
        
        if (showToast) {
          toast.success("Real-time market data loaded", {
            description: `Updated ${validStocks.length} stock prices`
          });
        }
      }
    } catch (error) {
      console.error('Error loading stocks:', error);
      if (showToast) {
        toast.error("Failed to load market data", {
          description: "Using cached data instead"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    if (!rateLimitHit) {
      loadStocks(true);
    } else {
      toast.error("Rate limit reached", {
        description: "Please wait or upgrade your API plan"
      });
    }
  };

  // Load initial data
  useEffect(() => {
    loadStocks(false);
  }, [apiKey]);

  // Auto-refresh every 5 minutes (instead of 30 seconds) to conserve API calls
  useEffect(() => {
    if (!apiKey || rateLimitHit) return;

    const interval = setInterval(() => {
      loadStocks(false);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [apiKey, rateLimitHit]);

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
            <Badge className={`${
              apiKey && !rateLimitHit 
                ? 'bg-green-500/20 text-green-400' 
                : rateLimitHit 
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {apiKey && !rateLimitHit ? 'Live Data' : rateLimitHit ? 'Rate Limited' : 'Demo Mode'}
            </Badge>
            {apiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || rateLimitHit}
                className="ml-auto bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </CardTitle>
          {apiKey && (
            <p className="text-xs text-slate-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
              {rateLimitHit && " • Rate limit reached"}
            </p>
          )}
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
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-slate-600 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-32"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 bg-slate-600 rounded w-16 mb-1"></div>
                      <div className="h-3 bg-slate-700 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
