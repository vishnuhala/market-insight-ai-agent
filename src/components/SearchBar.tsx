
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search any company or symbol..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 w-64 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};
