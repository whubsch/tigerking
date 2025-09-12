import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsStore {
  // Settings state
  advancedMode: boolean;
  includeTracks: boolean;

  // Actions
  setAdvancedMode: (enabled: boolean) => void;
  setIncludeTracks: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      advancedMode: false,
      includeTracks: false,

      // Actions
      setAdvancedMode: (enabled) => set({ advancedMode: enabled }),
      setIncludeTracks: (enabled) => set({ includeTracks: enabled }),
    }),
    {
      name: "tigerking-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
