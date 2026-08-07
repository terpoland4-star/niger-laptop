export const ProductCardSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border animate-pulse">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-secondary" />

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-4">
        <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
        <div className="h-3 bg-secondary rounded w-full mb-1" />
        <div className="h-3 bg-secondary rounded w-2/3 mb-3" />

        <div className="mb-4 mt-auto">
          <div className="h-4 bg-secondary rounded w-1/2" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-secondary rounded-lg" />
            <div className="flex-1 h-9 bg-secondary rounded-lg" />
          </div>
          <div className="h-3 bg-secondary rounded w-2/3 mx-auto mt-1" />
          <div className="h-8 bg-secondary rounded-lg" />
        </div>
      </div>
    </div>
  );
};
