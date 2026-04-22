import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OsmWay } from "../objects";

interface WayStore {
  overpassWays: OsmWay[];
  wayIds: number[]; // IDs fetched from Overpass
  currentWay: number;
  uploadWays: OsmWay[];
  wayDetailsCache: Map<number, OsmWay>; // Cache for fetched way details
  isFetchingNext: boolean; // Whether we're currently prefetching the next way
  setOverpassWays: (ways: OsmWay[]) => void;
  setWayIds: (ids: number[]) => void;
  setCurrentWay: (index: number) => void;
  setUploadWays: (ways: OsmWay[]) => void;
  addToUpload: (way: OsmWay) => void;
  setCachedWay: (wayId: number, way: OsmWay) => void;
  getCachedWay: (wayId: number) => OsmWay | undefined;
  setIsFetchingNext: (isFetching: boolean) => void;
  resetWays: () => void;
}

export const useWayStore = create<WayStore>()(
  persist(
    (set, get) => ({
      overpassWays: [],
      wayIds: [],
      currentWay: 0,
      uploadWays: [],
      wayDetailsCache: new Map<number, OsmWay>(),
      isFetchingNext: false,
      setOverpassWays: (ways) => set({ overpassWays: ways }),
      setWayIds: (ids) => set({ wayIds: ids }),
      setCurrentWay: (index) => set({ currentWay: index }),
      setUploadWays: (ways) => set({ uploadWays: ways }),
      addToUpload: (way) =>
        set((state) => ({
          uploadWays: [...state.uploadWays, way],
        })),
      setCachedWay: (wayId, way) => {
        set((state) => {
          const newCache = new Map(state.wayDetailsCache);
          newCache.set(wayId, way);
          return { wayDetailsCache: newCache };
        });
      },
      getCachedWay: (wayId) => {
        return get().wayDetailsCache.get(wayId);
      },
      setIsFetchingNext: (isFetching) => set({ isFetchingNext: isFetching }),
      resetWays: () =>
        set({
          overpassWays: [],
          wayIds: [],
          currentWay: 0,
          wayDetailsCache: new Map(),
        }),
    }),
    {
      name: "tigerking-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ uploadWays: state.uploadWays }),
    },
  ),
);
