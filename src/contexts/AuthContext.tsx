import { useState, useEffect, ReactNode } from "react";
import {
  loginAndfetchOsmUser,
  osmLogout,
  handleOAuthCallback,
  OsmUser,
} from "../services/auth";
import Cookies from "js-cookie";
import { OsmAuthContext, OsmAuthType } from "./OsmAuthContextDef";

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

export const OsmAuthProvider = ({
  children,
  cookies = {},
}: OsmAuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth...");
      try {
        // First check for stored user
        const storedUser = Cookies.get("osmUserForSSR");
        console.log("Checking stored user:", storedUser);

        if (storedUser) {
          try {
            setOsmUser(JSON.parse(storedUser));
            console.log("Found stored user, auth complete");
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }

        // If no stored user, check for OAuth callback
        const user = await handleOAuthCallback();
        if (user) {
          console.log("User found from OAuth callback:", user);
          setOsmUser(user);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        console.log("Auth initialization complete");
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setOsmUser]); // Run once on mount

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
  };

  const handleLogin = () => loginAndfetchOsmUser().then(successfulLogin);
  const handleLogout = () => osmLogout().then(() => setOsmUser(undefined));

  const value: OsmAuthType = {
    loggedIn: !!osmUser,
    osmUser: osmUser?.name || "",
    userImage: osmUser?.imageUrl || "",
    changesetCount: osmUser?.changesetCount || 0,
    loading,
    handleLogin,
    handleLogout,
  };

  console.log("Auth context value:", value); // Add this log

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};
