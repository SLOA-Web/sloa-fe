"use client";
import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  totalResults: number;
  searchPlaceholder?: string;
  resultsLabel?: string;
  searchLabel?: string;
  filterLabel?: string;
  className?: string;
  showFilter?: boolean;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filterOptions,
  totalResults,
  searchPlaceholder = "Search...",
  resultsLabel = "results found",
  searchLabel = "Search",
  filterLabel = "Filter By",
  className = "",
  showFilter = true,
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg rounded-2xl shadow-md border border-primary/20 p-3 lg:p-6 mb-12 ${className}`}
    >
      <div
        className={`flex flex-col lg:flex-row lg:items-center gap-6 lg:justify-between`}
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <label
            htmlFor="search-input"
            className="block text-sm font-medium text-gray-700 mb-2 font-roboto uppercase tracking-wide"
          >
            {searchLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary/70"
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
            <input
              id="search-input"
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-primary/20 rounded-[8px] focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 font-poppins hover:border-primary/40 hover:bg-white/80 text-base"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-3 lg:gap-6">
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="relative ">
              <label
                htmlFor="filter-select"
                className="block text-sm font-medium text-gray-700 mb-2 font-roboto uppercase tracking-wide"
              >
                {filterLabel}
              </label>
              <div className="relative border-2 border-primary/20 rounded-[8px] flex-1">
                <select
                  id="filter-select"
                  className="appearance-none bg-white/60 px-4 py-4 pr-12 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 focus:bg-white transition-all duration-300 text-gray-800 lg:min-w-[200px] font-poppins hover:border-primary/40 hover:bg-white/80 cursor-pointer text-base"
                  value={selectedFilter}
                  onChange={(e) => onFilterChange(e.target.value)}
                >
                  {filterOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="font-poppins py-2"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-primary/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Results Counter */}
          <div className="flex flex-col items-center lg:items-end flex-1">
            <span className="text-base font-medium text-gray-600 mb-1 font-roboto uppercase tracking-wide">
              Total Results
            </span>
            <div className="text-lg font-bold text-primary font-roboto bg-gradient-to-r from-primary/10 to-primary/5 p-4 py-3 rounded-[8px] border-2 border-primary/20">
              {totalResults}{" "}
              <span className="text-sm font-medium text-primary/80 font-poppins">
                {resultsLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
