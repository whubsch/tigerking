import { create } from "zustand";

interface ZoomXY {
  zoom: number;
  x: number;
  y: number;
}

// Define the interface for the bbox
export interface BBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Define the interface for the store
interface BBoxStore {
  bboxState: BBox;
  setBBoxState: (newBBox: BBox) => void;
  updateFromZXY: (zxy: ZoomXY) => void;
}

// Create the store
export const useBBoxStore = create<BBoxStore>((set) => ({
  // Initial state
  bboxState: {
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  },

  // Method to set bbox directly
  setBBoxState: (newBBox: BBox) => set({ bboxState: newBBox }),

  // Method to calculate and update bbox from zoom/lat/lon
  updateFromZXY: (zxy: ZoomXY) => {
    // Setting upper and lower bounds for zoom levels
    const degreesPerTile =
      360 / Math.pow(2, Math.min(Math.max(zxy.zoom, 12), 18));

    const tilesAcross = 3;
    const tilesUp = 3;

    const latHeight = degreesPerTile * tilesUp;
    const lonWidth = degreesPerTile * tilesAcross;

    const newBBox = {
      north: zxy.x + latHeight / 2,
      south: zxy.x - latHeight / 2,
      east: zxy.y + lonWidth / 2,
      west: zxy.y - lonWidth / 2,
    };

    set({ bboxState: newBBox });
  },
}));
