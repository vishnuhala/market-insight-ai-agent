
import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MarketOverview } from '../components/MarketOverview';
import { CompanyDetail } from '../components/CompanyDetail';
import { AgentSystem } from '../components/AgentSystem';
import { PredictionPanel } from '../components/PredictionPanel';
import { RealTimeData } from '../components/RealTimeData';
import { toast } from 'sonner';

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    // Initialize the application
    toast.success("AI Stock Market Agent System Initialized", {
      description: "Real-time data feeds connected, agents activated"
    });
  }, []);

  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol);
    toast.info(`Analyzing ${symbol}`, {
      description: "AI agents gathering comprehensive data..."
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Search completed", {
        description: `Found results for "${query}"`
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-white">StockMind AI</h1>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                Live Data Active
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Market Open</span>
              </div>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Agent System */}
          <div className="col-span-12 lg:col-span-3">
            <AgentSystem searchQuery={searchQuery} />
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-6">
            {selectedCompany ? (
              <CompanyDetail 
                symbol={selectedCompany} 
                onBack={() => setSelectedCompany(null)} 
              />
            ) : (
              <MarketOverview onCompanySelect={handleCompanySelect} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <RealTimeData />
            <PredictionPanel selectedCompany={selectedCompany} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
