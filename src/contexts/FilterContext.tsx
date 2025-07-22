"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface FilterState {
  selectedGeneration: string;
  selectedType: string;
  searchText: string;
  currentPage: number;
  pageSize: number;
}

interface FilterContextType {
  filters: FilterState;
  setSelectedGeneration: (value: string) => void;
  setSelectedType: (value: string) => void;
  setSearchText: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setPageSize: (value: number) => void;
  resetFilters: () => void;
}

const defaultState: FilterState = {
  selectedGeneration: "",
  selectedType: "",
  searchText: "",
  currentPage: 1,
  pageSize: 12,
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultState);

  const setSelectedGeneration = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      selectedGeneration: value,
      selectedType: "", // Reset type when generation changes
      currentPage: 1 // Reset page when filters change
    }));
  };

  const setSelectedType = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      selectedType: value,
      currentPage: 1 // Reset page when filters change
    }));
  };

  const setSearchText = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      searchText: value,
      currentPage: 1 // Reset page when filters change
    }));
  };

  const setCurrentPage = (value: number) => {
    setFilters(prev => ({ ...prev, currentPage: value }));
  };

  const setPageSize = (value: number) => {
    setFilters(prev => ({ ...prev, pageSize: value, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters(defaultState);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setSelectedGeneration,
      setSelectedType,
      setSearchText,
      setCurrentPage,
      setPageSize,
      resetFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
} 