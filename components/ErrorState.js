export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200 max-w-md">
        {/* Error Icon */}
        <div className="text-4xl mb-4">⚠️</div>
        
        {/* Error Message */}
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Something went wrong
        </h3>
        <p className="text-red-600 text-sm mb-4">
          {error || "Failed to load products. Please try again."}
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          🔄 Retry
        </button>
      </div>
    </div>
  );
}