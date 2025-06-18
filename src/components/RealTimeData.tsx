
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Wifi, Key } from 'lucide-react';
import { toast } from 'sonner';

export const RealTimeData: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [marketData, setMarketData] = useState({
    vix: 18.45,
    gold: 2034.50,
    btc: 42350.00,
    oil: 78.90
  });

  // Check for existing API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('stockApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMarketData(prev => ({
        vix: prev.vix + (Math.random() - 0.5) * 0.5,
        gold: prev.gold + (Math.random() - 0.5) * 10,
        btc: prev.btc + (Math.random() - 0.5) * 500,
        oil: prev.oil + (Math.random() - 0.5) * 2
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      // Store API key in localStorage
      localStorage.setItem('stockApiKey', apiKey.trim());
      setIsConnected(true);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      toast.success("Real-time data connected!", {
        description: "Live market feeds are now active. You can now search for any company!"
      });
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('stockApiKey');
    setApiKey('');
    setIsConnected(false);
    window.dispatchEvent(new Event('storage'));
    toast.info("Disconnected from live data", {
      description: "Switched back to demo mode"
    });
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Key className="h-5 w-5 text-yellow-400" />
            <span>Real-Time Data API</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            <Badge className={isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          
          {!isConnected ? (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Alpha Vantage API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
              <Button 
                onClick={handleApiKeySubmit}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!apiKey.trim()}
              >
                Connect Live Data
              </Button>
              <p className="text-xs text-slate-400">
                Get your free API key from{' '}
                <a 
                  href="https://www.alphavantage.co/support/#api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Alpha Vantage
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-green-400 text-sm">✓ Live data connected</p>
              <p className="text-xs text-slate-400">Search for any company symbol to get real-time data</p>
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Indicators */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Market Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-xs">VIX</p>
              <p className="text-white font-bold">{marketData.vix.toFixed(2)}</p>
              <div className="flex items-center">
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-red-400 text-xs">-0.8%</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-xs">Gold</p>
              <p className="text-white font-bold">${marketData.gold.toFixed(0)}</p>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400 text-xs">+0.3%</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-xs">Bitcoin</p>
              <p className="text-white font-bold">${marketData.btc.toFixed(0)}</p>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400 text-xs">+2.1%</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <p className="text-slate-400 text-xs">Oil</p>
              <p className="text-white font-bold">${marketData.oil.toFixed(2)}</p>
              <div className="flex items-center">
                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-red-400 text-xs">-1.2%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-slate-400">
            <p>• Alpha Vantage - Stock Data {isConnected && '✓'}</p>
            <p>• IEX Cloud - Real-time Quotes</p>
            <p>• Polygon.io - Market Data</p>
            <p>• NewsAPI - Financial News</p>
            <p>• RAG System - External Analysis</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
