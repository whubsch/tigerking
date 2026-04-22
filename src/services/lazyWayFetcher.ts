import { OsmWay } from "../objects";
import { fetchWayFromApi } from "./osmApi";

const PREFETCH_DELAY_MS = 100; // Delay between requests to respect rate limits

interface LazyWayFetcherOptions {
  wayIds: number[];
  onWayLoaded?: (way: OsmWay, wayId: number) => void;
  onError?: (error: string, wayId: number) => void;
}

/**
 * Service to manage lazy loading of way details from OSM API
 * Fetches way details on-demand while prefetching the next way in the background
 */
export class LazyWayFetcher {
  private wayIds: number[];
  private cache: Map<number, OsmWay> = new Map();
  private fetchPromises: Map<number, Promise<OsmWay | null>> = new Map();
  private onWayLoaded?: (way: OsmWay, wayId: number) => void;
  private onError?: (error: string, wayId: number) => void;
  private prefetchTimeouts: Map<number, ReturnType<typeof setTimeout>> =
    new Map();

  constructor(options: LazyWayFetcherOptions) {
    this.wayIds = options.wayIds;
    this.onWayLoaded = options.onWayLoaded;
    this.onError = options.onError;
  }

  /**
   * Update the way IDs (useful when fetching new query results)
   */
  setWayIds(wayIds: number[]): void {
    this.wayIds = wayIds;
    // Optionally clear cache when IDs change
    this.cache.clear();
    this.fetchPromises.clear();
  }

  /**
   * Get the total number of ways
   */
  getWayCount(): number {
    return this.wayIds.length;
  }

  /**
   * Check if a way is cached
   */
  isCached(wayId: number): boolean {
    return this.cache.has(wayId);
  }

  /**
   * Get cached way if available
   */
  getCached(wayId: number): OsmWay | null {
    return this.cache.get(wayId) || null;
  }

  /**
   * Fetch a way's details, using cache if available
   * Returns a promise that resolves when the way is loaded
   */
  async fetch(wayId: number): Promise<OsmWay | null> {
    // Return cached version if available
    const cached = this.cache.get(wayId);
    if (cached) {
      return cached;
    }

    // Return existing promise if fetch is in progress
    const existingPromise = this.fetchPromises.get(wayId);
    if (existingPromise) {
      return existingPromise;
    }

    // Create and cache the fetch promise
    const fetchPromise = this.performFetch(wayId);
    this.fetchPromises.set(wayId, fetchPromise);

    try {
      const way = await fetchPromise;
      return way;
    } finally {
      this.fetchPromises.delete(wayId);
    }
  }

  /**
   * Perform the actual fetch
   */
  private async performFetch(wayId: number): Promise<OsmWay | null> {
    try {
      const way = await fetchWayFromApi(wayId);
      this.cache.set(wayId, way);
      this.onWayLoaded?.(way, wayId);
      return way;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`Error fetching way ${wayId}:`, errorMsg);
      this.onError?.(errorMsg, wayId);
      return null;
    }
  }

  /**
   * Get way by index in the way IDs array
   */
  async getWayAtIndex(index: number): Promise<OsmWay | null> {
    if (index < 0 || index >= this.wayIds.length) {
      return null;
    }
    return this.fetch(this.wayIds[index]);
  }

  /**
   * Prefetch the next way after current index
   */
  prefetchNext(currentIndex: number): void {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= this.wayIds.length) {
      return; // No more ways to prefetch
    }

    const nextWayId = this.wayIds[nextIndex];

    // Don't prefetch if already cached or being fetched
    if (this.cache.has(nextWayId) || this.fetchPromises.has(nextWayId)) {
      return;
    }

    // Clear any existing timeout for this way
    const existingTimeout = this.prefetchTimeouts.get(nextWayId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule prefetch with delay
    const timeout = setTimeout(() => {
      this.fetch(nextWayId);
      this.prefetchTimeouts.delete(nextWayId);
    }, PREFETCH_DELAY_MS);

    this.prefetchTimeouts.set(nextWayId, timeout);
  }

  /**
   * Cancel prefetch of a specific way
   */
  cancelPrefetch(wayId: number): void {
    const timeout = this.prefetchTimeouts.get(wayId);
    if (timeout) {
      clearTimeout(timeout);
      this.prefetchTimeouts.delete(wayId);
    }
  }

  /**
   * Cancel all pending prefetches
   */
  cancelAllPrefetches(): void {
    this.prefetchTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.prefetchTimeouts.clear();
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Destroy the fetcher and clean up resources
   */
  destroy(): void {
    this.cancelAllPrefetches();
    this.cache.clear();
    this.fetchPromises.clear();
  }
}
