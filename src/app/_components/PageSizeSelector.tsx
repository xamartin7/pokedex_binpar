const PAGE_SIZE_OPTIONS = [6, 12, 18, 24, 30];

export function PageSizeSelector({pageSize, handlePageSizeChange}: {pageSize: number, handlePageSizeChange: (newPageSize: number) => void}) {
  return (
        <div className="flex justify-left items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Items per page:</span>
            <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                    {size}
                </option>
                ))}
            </select>
        </div>
  );
}