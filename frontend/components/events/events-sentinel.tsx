import { useEffect, useRef } from "react";

interface EventsSentinelProps {
  hasNextPage: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
}

export function EventsSentinel({
  hasNextPage,
  isFetching,
  onLoadMore,
}: EventsSentinelProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div ref={loadMoreRef} className="flex justify-center mt-12 py-8">
      {isFetching && (
        <div className="flex items-center gap-3 bg-neo-lime border-4 border-neo-black px-6 py-3 shadow-neo">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="font-bold">Loading...</span>
        </div>
      )}
    </div>
  );
}
