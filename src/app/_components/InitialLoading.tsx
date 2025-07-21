'use client';

export function InitialLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      {/* Spinning Pokeball */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* Loading text with animation */}
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-gray-800">Loading Pokédex</div>
        <div className="text-gray-600 animate-pulse">Catching all Pokémon...</div>
      </div>
      
      {/* Loading dots animation */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
}