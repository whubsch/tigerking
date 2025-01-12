import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OsmWay } from "../objects";

interface WayStore {
  overpassWays: OsmWay[];
  currentWay: number;
  uploadWays: OsmWay[];
  setOverpassWays: (ways: OsmWay[]) => void;
  setCurrentWay: (index: number) => void;
  setUploadWays: (ways: OsmWay[]) => void;
  addToUpload: (way: OsmWay) => void;
  resetWays: () => void;
}

export const useWayStore = create<WayStore>()(
  persist(
    (set) => ({
      overpassWays: [],
      currentWay: 0,
      uploadWays: [],
      setOverpassWays: (ways) => set({ overpassWays: ways }),
      setCurrentWay: (index) => set({ currentWay: index }),
      setUploadWays: (ways) => set({ uploadWays: ways }),
      addToUpload: (way) =>
        set((state) => ({
          uploadWays: [...state.uploadWays, way],
        })),
      resetWays: () =>
        set({
          overpassWays: [],
          currentWay: 0,
        }),
    }),
    {
      name: "tigerking-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ uploadWays: state.uploadWays }),
    },
  ),
);
