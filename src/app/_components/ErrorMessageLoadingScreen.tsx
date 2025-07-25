export const ErrorMessageLoadingScreen = ({ error }: { error: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md w-full text-center">
        <h3 className="font-semibold text-lg mb-2">Error</h3>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )
}