import { create } from "zustand";

interface RelationType {
  id: string;
  name?: string;
}

interface ChangesetStoreState {
  relation: RelationType;
  source: string;
  host: string;
  description: string;
  setRelation: (relation: RelationType) => void;
  setSource: (source: string) => void;
  setHost: (host: string) => void;
  setDescription: (location: string) => void;
  resetDescription: () => void;
}

export const useChangesetStore = create<ChangesetStoreState>((set) => ({
  relation: { id: "", name: "" },
  source: "",
  host: "",
  description: "",
  setRelation: (relation) =>
    set((state) => ({
      relation: {
        id: relation.id,
        name: relation.name || state.relation.name,
      },
    })),
  setSource: (source) => set({ source }),
  setHost: (host) => set({ host }),
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
