import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { MarketOverview } from '../components/MarketOverview';
import { CompanyDetail } from '../components/CompanyDetail';
import { AgentSystem } from '../components/AgentSystem';
import { PredictionPanel } from '../components/PredictionPanel';
import { RealTimeData } from '../components/RealTimeData';
import { AuthModal } from '../components/AuthModal';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { HeroSection } from '../components/HeroSection';
import { MarketHeatMap } from '../components/MarketHeatMap';
import { MarketTicker } from '../components/MarketTicker';

interface SearchResult {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  exchange?: string;
  type: 'stock' | 'crypto' | 'forex';
}

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('stockmind_user');
    const authToken = localStorage.getItem('stockmind_auth_token');
    
    if (storedUser && authToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    toast.success(`Welcome ${userData.fullName}!`, {
      description: "You can now access all features"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('stockmind_user');
    localStorage.removeItem('stockmind_auth_token');
    setUser(null);
    toast.success("Logged out successfully");
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
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
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
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.fullName}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              )}
              
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </header>

      {/* Market Ticker */}
      <MarketTicker />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Show Hero Section only when no search or company is selected */}
        {!selectedCompany && !showSearchResults && (
          <div className="mb-8">
            <HeroSection />
          </div>
        )}

        {/* Updated Grid Layout with Better Spacing */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Agent System */}
          <div className="xl:col-span-3">
            <div className="sticky top-24">
              <AgentSystem searchQuery={searchQuery} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-6 space-y-6">
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
              <div className="space-y-6">
                <MarketOverview onCompanySelect={handleCompanySelect} />
                {/* Heat Map with Proper Spacing */}
                <div className="w-full">
                  <MarketHeatMap />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar with Fixed Layout */}
          <div className="xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <RealTimeData />
              <PredictionPanel selectedCompany={selectedCompany} />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
