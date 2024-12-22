import { createContext } from "react";

export interface OsmAuthType {
  loggedIn: boolean;
  osmUser: string;
  userImage: string;
  loading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const defaultAuthContext: OsmAuthType = {
  loggedIn: false,
  osmUser: "",
  userImage: "",
  loading: true,
  handleLogin: () => {
    console.warn("Auth context not initialized");
  },
  handleLogout: () => {
    console.warn("Auth context not initialized");
  },
};

export const OsmAuthContext = createContext<OsmAuthType>(defaultAuthContext);
