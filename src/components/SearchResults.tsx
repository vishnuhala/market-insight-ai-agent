
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Building2 } from 'lucide-react';

interface SearchResult {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  exchange?: string;
  type: 'stock' | 'crypto' | 'forex';
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  onCompanySelect: (symbol: string) => void;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  query, 
  results, 
  onCompanySelect, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Searching for "{query}"...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0 && query) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No results found for "{query}"</p>
            <p className="text-slate-500 text-sm mt-2">
              Try searching for popular stocks like AAPL, GOOGL, MSFT, or TSLA
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!query) {
    return null;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Search Results for "{query}"</span>
          <Badge className="bg-blue-500/20 text-blue-400">
            {results.length} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.symbol}
              className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => onCompanySelect(result.symbol)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-bold text-white">{result.symbol}</h3>
                      <p className="text-slate-400 text-sm">{result.name}</p>
                      {result.exchange && (
                        <p className="text-slate-500 text-xs">{result.exchange}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={`
                      ${result.type === 'stock' ? 'text-blue-400 border-blue-400' : ''}
                      ${result.type === 'crypto' ? 'text-orange-400 border-orange-400' : ''}
                      ${result.type === 'forex' ? 'text-green-400 border-green-400' : ''}
                    `}>
                      {result.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {result.price && (
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">
                      ${result.price.toFixed(2)}
                    </p>
                    {result.change !== undefined && (
                      <div className="flex items-center space-x-1">
                        {result.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          result.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.change >= 0 ? '+' : ''}
                          {result.change.toFixed(2)} ({result.changePercent?.toFixed(2)}%)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
