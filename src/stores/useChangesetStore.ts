import { create } from "zustand";

interface ChangesetStoreState {
  relationId: string;
  source: string;
  host: string;
  description: string;
  setRelationId: (id: string) => void;
  setSource: (source: string) => void;
  setHost: (host: string) => void;
  setDescription: (location: string) => void;
  resetDescription: () => void;
}

export const useChangesetStore = create<ChangesetStoreState>((set) => ({
  relationId: "",
  source: "",
  host: "",
  description: "",
  setRelationId: (id) => set({ relationId: id }),
  setSource: (source) => set({ source: source }),
  setHost: (host) => set({ host: host }),
  setDescription: (location) =>
    set({
      description: `Adding details to and removing tiger tags from \`tiger:reviewed=no\` ways${location ? ` in ${location}` : ""}`,
    }),
  resetDescription: () =>
    set({
      description:
        "Adding details to and removing tiger tags from `tiger:reviewed=no` ways",
    }),
}));
