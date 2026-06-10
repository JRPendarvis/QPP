"use client";
import { useState, useEffect } from 'react';

export interface FabricSearchFiltersProps {
  onSearchChange: (filters: FabricFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export interface FabricFilters {
  search: string;
  type: string;
  minYardage: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const fabricTypes = [
  { value: '', label: 'All Types' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'flannel', label: 'Flannel' },
  { value: 'linen', label: 'Linen' },
  { value: 'wool', label: 'Wool' },
  { value: 'silk', label: 'Silk' },
  { value: 'batik', label: 'Batik' },
  { value: 'minky', label: 'Minky' },
  { value: 'canvas', label: 'Canvas' },
  { value: 'other', label: 'Other' },
];

const sortOptions = [
  { value: 'date', label: 'Recently Updated' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'type', label: 'Type' },
  { value: 'yardage', label: 'Yardage Amount' },
];

export default function FabricSearchFilters({
  onSearchChange,
  totalCount,
  filteredCount,
}: FabricSearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [minYardage, setMinYardage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search and notify parent
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange({
        search,
        type,
        minYardage,
        sortBy,
        sortOrder,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, type, minYardage, sortBy, sortOrder, onSearchChange]);

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setMinYardage('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const hasActiveFilters = search || type || minYardage;
  const isFiltering = totalCount !== filteredCount;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fabrics by name or notes..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Results Count */}
      {mounted && isFiltering && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCount}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalCount}</span> fabrics
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fabric Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {fabricTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Yardage */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Yardage
            </label>
            <input
              type="number"
              value={minYardage}
              onChange={(e) => setMinYardage(e.target.value)}
              placeholder="e.g., 1.5"
              min="0"
              step="0.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
