export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Top Animated Progress Beam */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 z-50 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />

      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-slate-800/80 rounded-md" />

      {/* Hero / Header Skeleton */}
      <div className="h-48 sm:h-64 w-full bg-[#0b1220] border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-center space-y-4">
        <div className="h-8 w-2/3 max-w-md bg-slate-800 rounded-xl" />
        <div className="h-4 w-1/2 max-w-sm bg-slate-800/60 rounded-lg" />
        <div className="h-10 w-36 bg-blue-600/30 rounded-xl mt-2" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="bg-[#0b1220] border border-slate-800/80 rounded-[18px] p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="aspect-square w-full bg-slate-800/60 rounded-xl" />
            <div className="space-y-2 pt-1">
              <div className="h-4 w-3/4 bg-slate-800 rounded" />
              <div className="h-5 w-1/2 bg-blue-500/20 rounded" />
              <div className="h-3 w-1/3 bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

