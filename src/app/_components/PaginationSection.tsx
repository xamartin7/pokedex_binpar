import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";
import { useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";

const PAGE_SIZE_OPTIONS = [8, 12, 16, 20, 24];
const INITIAL_CURRENT_PAGE = 1;

interface PaginationSectionProps {
  pokemonList: Pokemon[];
}

export function PaginationSection({
  pokemonList,
}: PaginationSectionProps) {
  const { 
    filters: { currentPage, pageSize, selectedGeneration },
    pokemonData: { generations },
    setCurrentPage,
    setPageSize,
    setSelectedGeneration,
    updatePaginatedList
  } = useFilters();

  const totalPages = Math.ceil(pokemonList.length / pageSize);
  const currentGenerationId = parseInt(selectedGeneration);
  const nextGeneration = generations.find(gen => gen.id === currentGenerationId + 1);
  const previousGeneration = generations.find(gen => gen.id === currentGenerationId - 1);
  const isLastPageAndHasNextGeneration = currentPage === totalPages && nextGeneration;
  const isFirstPageAndHasPreviousGeneration = currentPage === 1 && previousGeneration;

  // Reset to first page when pokemon list changes (e.g., when filters are applied)
  useEffect(() => {
    setCurrentPage(currentPage ?? INITIAL_CURRENT_PAGE);
  }, [pokemonList, setCurrentPage]);

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
    const paginationSection = document.getElementById('pagination-section');
    if (paginationSection) {
      paginationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextGeneration = () => {
    if (nextGeneration) {
      setSelectedGeneration(nextGeneration.id.toString());
      // Scroll to top when generation changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousGeneration = () => {
    if (previousGeneration) {
      setSelectedGeneration(previousGeneration.id.toString());
      // Scroll to top when generation changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextClick = () => {
    if (isLastPageAndHasNextGeneration) {
      handleNextGeneration();
    } else {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePreviousClick = () => {
    if (isFirstPageAndHasPreviousGeneration) {
      handlePreviousGeneration();
    } else {
      handlePageChange(currentPage - 1);
    }
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
              onClick={handlePreviousClick}
              disabled={currentPage === 1 && !previousGeneration}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 1 && !previousGeneration
                  ? 'text-gray-500 bg-white border border-gray-300 opacity-50 cursor-not-allowed'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {isFirstPageAndHasPreviousGeneration ? `Previous Gen ←` : 'Previous'}
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
              onClick={handleNextClick}
              disabled={currentPage === totalPages && !nextGeneration}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isLastPageAndHasNextGeneration
                  ? 'bg-green-600 text-white hover:bg-green-700 border border-green-600'
                  : currentPage === totalPages && !nextGeneration
                  ? 'text-gray-500 bg-white border border-gray-300 opacity-50 cursor-not-allowed'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
              title={isLastPageAndHasNextGeneration ? `Go to ${nextGeneration.name}` : 'Next page'}
            >
              {isLastPageAndHasNextGeneration ? `Next Gen →` : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 