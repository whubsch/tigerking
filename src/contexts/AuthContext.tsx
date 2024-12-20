import { createContext, useContext, useState, ReactNode } from "react";
import { loginAndfetchOsmUser, osmLogout, OsmUser } from "../services/auth";

interface OsmAuthType {
  loggedIn: boolean;
  osmUser: string;
  userImage: string;
  handleLogin: () => void;
  handleLogout: () => void;
}

const defaultAuthContext: OsmAuthType = {
  loggedIn: false,
  osmUser: "",
  userImage: "",
  handleLogin: () => {
    console.warn("Auth context not initialized");
  },
  handleLogout: () => {
    console.warn("Auth context not initialized");
  },
};

interface OsmAuthProviderProps {
  children: ReactNode;
  cookies?: {
    osmUserForSSR?: any; // You can make this more specific if needed
  };
}

const useOsmUserState = (cookies?: { osmUserForSSR?: any }) => {
  const initialState = cookies?.osmUserForSSR;
  return useState<OsmUser | undefined>(initialState);
};

export const OsmAuthContext = createContext<OsmAuthType>(defaultAuthContext);

export const OsmAuthProvider = ({
  children,
  cookies = {},
}: OsmAuthProviderProps) => {
  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
  };

  const handleLogin = () => loginAndfetchOsmUser().then(successfulLogin);
  const handleLogout = () => osmLogout().then(() => setOsmUser(undefined));

  const value = {
    loggedIn: !!osmUser,
    osmUser: osmUser?.name || "", // TODO rename
    userImage: osmUser?.imageUrl || "",
    handleLogin,
    handleLogout,
  };

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};

export const useOsmAuthContext = () => useContext(OsmAuthContext);
