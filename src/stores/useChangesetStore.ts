import { create } from "zustand";

interface ChangesetStoreState {
  relationId: string;
  location: string;
  source: string;
  host: string;
  setRelationId: (id: string) => void;
  setLocation: (location: string) => void;
  setSource: (source: string) => void;
  setHost: (host: string) => void;
}

export const useChangesetStore = create<ChangesetStoreState>((set) => ({
  relationId: "",
  location: "",
  source: "",
  host: "",
  setRelationId: (id) => set({ relationId: id }),
  setLocation: (location) => set({ location: location }),
  setSource: (source) => set({ source: source }),
  setHost: (host) => set({ host: host }),
}));
