
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
  const [apiKey, setApiKey] = useState('');

  // Get API key from localStorage or state
  useEffect(() => {
    const storedApiKey = localStorage.getItem('stockApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    // Initialize the application
    toast.success("AI Stock Market Agent System Initialized", {
      description: "Real-time data feeds connected, agents activated"
    });
  }, []);

  // Real API search function
  const searchCompanies = async (query: string) => {
    if (!apiKey) {
      toast.error("API key required", {
        description: "Please enter your API key in the Real-Time Data panel"
      });
      return [];
    }

    try {
      console.log(`Searching for: ${query}`);
      
      // Try Alpha Vantage API first
      const searchUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      console.log('API Response:', data);

      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      const matches = data['bestMatches'] || [];
      
      // Transform API data to our format
      const results: SearchResult[] = await Promise.all(
        matches.slice(0, 10).map(async (match: any) => {
          let price, change, changePercent;
          
          // Try to get real-time price data
          try {
            const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${match['1. symbol']}&apikey=${apiKey}`;
            const quoteResponse = await fetch(quoteUrl);
            const quoteData = await quoteResponse.json();
            
            if (quoteData['Global Quote']) {
              const quote = quoteData['Global Quote'];
              price = parseFloat(quote['05. price']);
              change = parseFloat(quote['09. change']);
              changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
            }
          } catch (error) {
            console.log('Could not fetch price for', match['1. symbol']);
          }
          
          return {
            symbol: match['1. symbol'],
            name: match['2. name'],
            price,
            change,
            changePercent,
            exchange: match['4. region'],
            type: 'stock' as const
          };
        })
      );

      return results;
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Search failed", {
        description: error instanceof Error ? error.message : "Failed to search companies"
      });
      return [];
    }
  };

  const handleCompanySelect = (symbol: string) => {
    setSelectedCompany(symbol);
    setSearchQuery(''); // Clear search when selecting a company
    setSearchResults([]); // Clear search results
    toast.info(`Analyzing ${symbol}`, {
      description: "AI agents gathering comprehensive data..."
    });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      const results = await searchCompanies(query);
      setSearchResults(results);
      
      toast.success("Search completed", {
        description: `Found ${results.length} results for "${query}"`
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast.error("Search failed", {
        description: "Please check your API key and try again"
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for API key updates from RealTimeData component
  useEffect(() => {
    const handleStorageChange = () => {
      const newApiKey = localStorage.getItem('stockApiKey');
      if (newApiKey) {
        setApiKey(newApiKey);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
                {apiKey ? 'Live Data Active' : 'Demo Mode'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className={`h-2 w-2 ${apiKey ? 'bg-green-500' : 'bg-yellow-500'} rounded-full animate-pulse`}></div>
                <span>{apiKey ? 'Market Open' : 'Demo Mode'}</span>
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
