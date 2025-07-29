export default function TemplateCardSkeleton() {
    return (
      <div className="relative group bg-black border border-black-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
        <div className="relative w-full h-48 bg-gray-900 flex items-center justify-center overflow-hidden">
          {/* Placeholder for image */}
          <div className="w-full h-full bg-gray-800" />
        </div>
        <div className="p-4 flex flex-col gap-2">
          {/* Placeholder for title */}
          <div className="h-5 bg-gray-800 rounded w-3/4" />
          {/* Placeholder for description */}
          <div className="h-4 bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          {/* Placeholder for author */}
          <div className="flex items-center mt-2">
            <div className="w-5 h-5 rounded-full bg-gray-800 mr-2" />
            <div className="h-3 bg-gray-800 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }
  