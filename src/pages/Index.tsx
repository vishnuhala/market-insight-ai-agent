
import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { MarketOverview } from '../components/MarketOverview';
import { CompanyDetail } from '../components/CompanyDetail';
import { AgentSystem } from '../components/AgentSystem';
import { PredictionPanel } from '../components/PredictionPanel';
import { RealTimeData } from '../components/RealTimeData';
import { toast } from 'sonner';

interface SearchResult {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  exchange?: string;
  type: 'stock' | 'crypto' | 'forex';
}

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);

  // Mock database of companies for search
  const mockCompanies: SearchResult[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.34, changePercent: 1.35, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.45, changePercent: -1.04, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 4.23, changePercent: 1.13, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -8.34, changePercent: -3.25, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, change: 15.67, changePercent: 1.82, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.86, change: 0.92, changePercent: 0.63, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 487.22, change: 12.45, changePercent: 2.62, exchange: 'NASDAQ', type: 'stock' },
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 42350.00, change: 1250.30, changePercent: 3.04, exchange: 'Crypto', type: 'crypto' },
    { symbol: 'ETH-USD', name: 'Ethereum', price: 2645.75, change: -45.20, changePercent: -1.68, exchange: 'Crypto', type: 'crypto' },
    { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0875, change: 0.0012, changePercent: 0.11, exchange: 'Forex', type: 'forex' },
  ];

  useEffect(() => {
    // Initialize the application
    toast.success("AI Stock Market Agent System Initialized", {
      description: "Real-time data feeds connected, agents activated"
    });
  }, []);

  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol);
    setSearchQuery(''); // Clear search when selecting a company
    setSearchResults([]); // Clear search results
    toast.info(`Analyzing ${symbol}`, {
      description: "AI agents gathering comprehensive data..."
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter companies based on search query
      const filteredResults = mockCompanies.filter(company => 
        company.symbol.toLowerCase().includes(query.toLowerCase()) ||
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsLoading(false);
      
      toast.success("Search completed", {
        description: `Found ${filteredResults.length} results for "${query}"`
      });
    }, 1000);
  };

  const showSearchResults = searchQuery && !selectedCompany;

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
            ) : showSearchResults ? (
              <SearchResults 
                query={searchQuery}
                results={searchResults}
                onCompanySelect={handleCompanySelect}
                isLoading={isLoading}
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
