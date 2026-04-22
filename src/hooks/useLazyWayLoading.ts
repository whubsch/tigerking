import { useEffect, useCallback, useRef } from "react";
import { OsmWay } from "../objects";
import { useWayStore } from "../stores/useWayStore";
import { fetchWayFromApi } from "../services/osmApi";

const PREFETCH_DELAY_MS = 100; // Delay between API requests to respect rate limits

interface UseLazyWayLoadingOptions {
  wayIds: number[];
  currentWayIndex: number;
  onWayLoaded?: (way: OsmWay) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for lazy loading way details from OSM API
 * Prefetches the next way's details while the user reviews the current way
 */
export const useLazyWayLoading = ({
  wayIds,
  currentWayIndex,
  onWayLoaded,
  onError,
}: UseLazyWayLoadingOptions) => {
  const { getCachedWay, setCachedWay, setIsFetchingNext, isFetchingNext } =
    useWayStore();

  const prefetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch a single way's details
   */
  const fetchWayDetails = useCallback(
    async (wayId: number): Promise<OsmWay | null> => {
      try {
        const way = await fetchWayFromApi(wayId);
        return way;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error fetching way ${wayId}:`, errorMsg);
        onError?.(errorMsg);
        return null;
      }
    },
    [onError],
  );

  /**
   * Get current way details, fetching if not cached
   */
  const getCurrentWay = useCallback(async (): Promise<OsmWay | null> => {
    if (currentWayIndex >= wayIds.length) {
      return null;
    }

    const wayId = wayIds[currentWayIndex];
    const cached = getCachedWay(wayId);

    if (cached) {
      return cached;
    }

    // Fetch immediately if not cached
    setIsFetchingNext(true);
    try {
      const way = await fetchWayDetails(wayId);
      if (way) {
        setCachedWay(wayId, way);
        onWayLoaded?.(way);
      }
      return way;
    } finally {
      setIsFetchingNext(false);
    }
  }, [
    wayIds,
    currentWayIndex,
    getCachedWay,
    setCachedWay,
    fetchWayDetails,
    setIsFetchingNext,
    onWayLoaded,
  ]);

  /**
   * Prefetch the next way's details in the background
   */
  const prefetchNextWay = useCallback(async () => {
    const nextWayIndex = currentWayIndex + 1;

    if (nextWayIndex >= wayIds.length) {
      return; // No more ways to prefetch
    }

    const nextWayId = wayIds[nextWayIndex];
    const cached = getCachedWay(nextWayId);

    if (cached) {
      return; // Already cached, no need to prefetch
    }

    setIsFetchingNext(true);
    try {
      const way = await fetchWayDetails(nextWayId);
      if (way) {
        setCachedWay(nextWayId, way);
      }
    } finally {
      setIsFetchingNext(false);
    }
  }, [
    wayIds,
    currentWayIndex,
    getCachedWay,
    setCachedWay,
    fetchWayDetails,
    setIsFetchingNext,
  ]);

  /**
   * Trigger prefetching of the next way with a small delay
   */
  useEffect(() => {
    // Clear any pending prefetch
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }

    // Set up a new prefetch after a delay
    prefetchTimeoutRef.current = setTimeout(() => {
      prefetchNextWay();
    }, PREFETCH_DELAY_MS);

    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, [currentWayIndex, prefetchNextWay]);

  /**
   * Cleanup abort controller on unmount
   */
  useEffect(() => {
    const abortController = abortControllerRef.current;
    const prefetchTimeout = prefetchTimeoutRef.current;

    return () => {
      if (abortController) {
        abortController.abort();
      }
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };
  }, []);

  return {
    getCurrentWay,
    prefetchNextWay,
    isFetchingNext,
  };
};
