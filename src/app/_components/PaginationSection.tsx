import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";

const PAGE_SIZE_OPTIONS = [6, 12, 18, 24, 30];
const INITIAL_CURRENT_PAGE = 1;

interface PaginationSectionProps {
  pokemonList: Pokemon[];
}

export function PaginationSection({
  pokemonList,
}: PaginationSectionProps) {
  const { 
    filters: { currentPage, pageSize },
    setCurrentPage,
    setPageSize,
    updatePaginatedList
  } = useFilters();

  const totalPages = Math.ceil(pokemonList.length / pageSize);

  // Reset to first page when pokemon list changes (e.g., when filters are applied)
  useEffect(() => {
    setCurrentPage(currentPage ?? INITIAL_CURRENT_PAGE);
  }, [pokemonList, setCurrentPage, currentPage]);

  // Calculate paginated data and update context
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = pokemonList.slice(startIndex, endIndex);
    updatePaginatedList(paginatedData);
  }, [currentPage, pageSize, pokemonList, updatePaginatedList]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(INITIAL_CURRENT_PAGE); // Reset to first page when changing page size
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  };
  

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, pokemonList.length);
  const totalItems = pokemonList.length;

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {getPaginationRange().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {startIndex} to {endIndex} of {totalItems} Pokémon
      </div>
    </div>
  );
} 