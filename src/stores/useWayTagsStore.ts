import { create } from "zustand";

interface WayTagsState {
  // Surface state
  surface: string;
  setSurface: (surface: string) => void;

  // Lanes state
  lanes: string;
  setLanes: (lanes: string) => void;
  laneMarkings: boolean;
  setLaneMarkings: (hasMarkings: boolean) => void;

  // Lane direction state
  showLaneDirection: boolean;
  setShowLaneDirection: (show: boolean) => void;
  lanesForward: number;
  setLanesForward: (lanes: number) => void;
  lanesBackward: number;
  setLanesBackward: (lanes: number) => void;

  // Driveway state
  convertDriveway: boolean;
  setConvertDriveway: (convert: boolean) => void;

  // Reset all states
  resetTags: () => void;
}

export const useWayTagsStore = create<WayTagsState>((set) => ({
  // Surface
  surface: "",
  setSurface: (surface) => set({ surface }),
  laneMarkings: true,
  setLaneMarkings: (hasMarkings) => set({ laneMarkings: hasMarkings }),

  // Lanes
  lanes: "",
  setLanes: (lanes) => set({ lanes }),

  // Lane direction
  showLaneDirection: false,
  setShowLaneDirection: (show) => set({ showLaneDirection: show }),
  lanesForward: 0,
  setLanesForward: (lanes) => set({ lanesForward: lanes }),
  lanesBackward: 0,
  setLanesBackward: (lanes) => set({ lanesBackward: lanes }),

  // Driveway
  convertDriveway: false,
  setConvertDriveway: (convert) => set({ convertDriveway: convert }),

  // Reset function
  resetTags: () =>
    set({
      surface: "",
      lanes: "",
      laneMarkings: true,
      showLaneDirection: false,
      lanesForward: 0,
      lanesBackward: 0,
      convertDriveway: false,
    }),
}));
