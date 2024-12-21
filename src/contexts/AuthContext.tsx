import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginAndfetchOsmUser,
  osmLogout,
  handleOAuthCallback,
  OsmUser,
} from "../services/auth";
import Cookies from "js-cookie";

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
  console.log("Initial cookies:", cookies);
  console.log("Stored cookies:", {
    osmAccessToken: Cookies.get("osmAccessToken"),
    osmUserForSSR: Cookies.get("osmUserForSSR"),
  });

  const [osmUser, setOsmUser] = useOsmUserState(cookies);

  // Add effect to handle OAuth callback
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const user = await handleOAuthCallback();
        if (user) {
          setOsmUser(user);
          // Remove the OAuth parameters from URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    handleAuth();
  }, []);

  // Add effect to check authentication state on mount
  useEffect(() => {
    const storedUser = Cookies.get("osmUserForSSR");
    console.log("Stored user on mount:", storedUser);

    if (storedUser) {
      try {
        setOsmUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  const successfulLogin = (user: OsmUser) => {
    setOsmUser(user);
  };

  const handleLogin = () => loginAndfetchOsmUser().then(successfulLogin);
  const handleLogout = () => osmLogout().then(() => setOsmUser(undefined));

  const value = {
    loggedIn: !!osmUser,
    osmUser: osmUser?.name || "",
    userImage: osmUser?.imageUrl || "",
    handleLogin,
    handleLogout,
  };

  return (
    <OsmAuthContext.Provider value={value}>{children}</OsmAuthContext.Provider>
  );
};

export const useOsmAuthContext = () => useContext(OsmAuthContext);
