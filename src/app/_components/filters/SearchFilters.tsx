import type { Pokemon } from "@/server/modules/pokemon/domain/entities/Pokemon";

interface SearchFiltersProps {
  searchText: string;
  onSearchChange: (searchText: string) => void;
  onGlobalSearch: () => void;
  filteredPokemonList: Pokemon[];
  disabled?: boolean;
  globalSearchLoading?: boolean;
  globalSearchError?: unknown;
  globalSearchIsError?: boolean;
}

export function SearchFilters({
  searchText,
  onSearchChange,
  onGlobalSearch,
  filteredPokemonList,
  disabled = false,
  globalSearchLoading = false,
  globalSearchError = null,
  globalSearchIsError = false
}: SearchFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleGlobalSearch = () => {
    if (searchText.trim()) {
      onGlobalSearch();
    }
  };

  // Check if we should show the global search button
  const shouldShowGlobalSearchButton = 
    searchText.trim().length > 0 && 
    filteredPokemonList.length === 0 && 
    !disabled &&
    !globalSearchLoading &&
    !globalSearchIsError;

  // Check if we should show the error message
  const shouldShowErrorMessage = 
    globalSearchIsError && 
    searchText.trim().length > 0 && 
    !globalSearchLoading;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (searchText.trim() && shouldShowGlobalSearchButton) {
        onGlobalSearch();
      }
    }
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      if (searchText.trim().length > 0) {
        onGlobalSearch();
      }
    }
  };

  // Get error message based on error type
  const getErrorMessage = () => {
    if (!globalSearchError) return "";
    
    // Safely check error properties
    const errorObj = globalSearchError as { data?: { code?: string }; message?: string };
    
    // Check if it's a "NOT_FOUND" error
    if (errorObj?.data?.code === "NOT_FOUND") {
      return `Pokemon "${searchText}" not found. Please check the spelling and try again.`;
    }

    // Handle other types of errors
    return `Error searching for Pokemon: ${errorObj?.message ?? 'Unknown error'}`;
  };

  return (
    <div className="mt-4">
      <label htmlFor="search-input" className="mb-2 text-sm font-medium text-gray-700 block">
        Search Pokemon
      </label>
      <input
        id="search-input"
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search by name or evolution..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-gray-500">
        Type to search Pokemon names and their evolutions in real time. Press <span className="font-bold">Ctrl + Enter</span> to search globally.
      </p>
      
      {/* Global Search Button */}
      {shouldShowGlobalSearchButton && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700 mb-2">
            No results found in current selection. Search globally for &ldquo;{searchText}&rdquo;?
          </p>
          <button
            onClick={handleGlobalSearch}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Search globally for &ldquo;{searchText}&rdquo;
          </button>
        </div>
      )}

      {/* Error Message */}
      {shouldShowErrorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                Search Error
              </p>
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage()}
              </p>
              <button
                onClick={handleGlobalSearch}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
