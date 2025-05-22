'use client';

import React, { useState } from 'react';
import { Rule } from '@/lib/types';
import { RulePreview } from './rule-preview';
import { Pagination } from '../ui/pagination';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PaginatedResult } from '@/lib/types';

type RuleListProps = {
  initialRules: PaginatedResult<Rule>;
  onSearch: (search: string, sortBy: string, page: number) => Promise<PaginatedResult<Rule>>;
  className?: string;
};

export function RuleList({ initialRules, onSearch, className }: RuleListProps) {
  // State
  const [rules, setRules] = useState<PaginatedResult<Rule>>(initialRules);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search submit
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await onSearch(searchQuery, sortBy, 1);
      
      if (!results || !results.data) {
        throw new Error('Received invalid search results');
      }
      
      setRules(results);
    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await onSearch(searchQuery, sortBy, page);
      
      if (!results || !results.data) {
        throw new Error('Received invalid pagination results');
      }
      
      setRules(results);

      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Page change failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = async (value: string) => {
    setSortBy(value);

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await onSearch(searchQuery, value, 1);
      
      if (!results || !results.data) {
        throw new Error('Received invalid sort results');
      }
      
      setRules(results);
    } catch (error) {
      console.error('Sort change failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to sort results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rules..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-md">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium block mb-1">Sort by</label>
              <Select
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Additional filters could be added here */}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="text-center py-4 mb-6 bg-destructive/10 rounded-md">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => handleSearch()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
          <p className="mt-2 text-muted-foreground">Loading rules...</p>
        </div>
      )}

      {/* Results count */}
      {!isLoading && !error && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {rules.pagination.totalCount === 0
              ? 'No rules found'
              : `Found ${rules.pagination.totalCount} rule${rules.pagination.totalCount === 1 ? '' : 's'}`}
          </p>
        </div>
      )}

      {/* Rules list */}
      {!isLoading && !error && rules.data && rules.data.length > 0 && (
        <div className="space-y-6">
          {rules.data.map((rule) => (
            <RulePreview key={rule.id} rule={rule} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (!rules.data || rules.data.length === 0) && (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-xl font-medium mb-2">No rules found</p>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && rules.pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={rules.pagination.page}
            totalPages={rules.pagination.totalPages}
            totalItems={rules.pagination.totalCount}
            pageSize={rules.pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
