const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {/* Small top bar */}
      <div className="w-40 h-6 bg-gray-300 rounded-lg animate-pulse"></div>

      {/* Two larger loading bars */}
      <div className="w-6/12 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
      <div className="w-9/12 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
    </div>
  );
};

export default SkeletonLoader;
