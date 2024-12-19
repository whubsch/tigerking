import osmAuth from "osm-auth";

const redirectPath = window.location.origin + window.location.pathname;
const auth = osmAuth({
  url: "https://www.openstreetmap.org", // OSM server URL
  client_id: import.meta.env.CLIENT_ID, // Get this from OSM
  redirect_uri: redirectPath,
  scope: ["read_prefs", "write_api"], // Scopes to request
  auto: true, // show a login form if the user is not authenticated and you try to do a call
  singlepage: true,
});

export const authService = {
  login: () => {
    return new Promise((resolve, reject) => {
      auth.authenticate((error: Error | null, oauth: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(oauth);
          saveAuth(oauth);
        }
      });
    });
  },

  logout: () => {
    auth.logout();
    clearAuth();
  },

  init: () => {
    const saved = loadAuth();
    if (saved.token && saved.token_secret) {
      auth.options({
        oauth_token: saved.token,
        oauth_token_secret: saved.token_secret,
      });
    }
  },

  isAuthenticated: () => {
    return auth.authenticated();
  },

  getDetails: () => {
    return new Promise((resolve, reject) => {
      auth.xhr(
        {
          method: "GET",
          path: "/api/0.6/user/details",
        },
        (error: Error | null, details: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(details);
          }
        },
      );
    });
  },
};

const saveAuth = (oauth: any) => {
  localStorage.setItem("osm_token", oauth.token);
  localStorage.setItem("osm_token_secret", oauth.token_secret);
};

const loadAuth = () => {
  return {
    token: localStorage.getItem("osm_token"),
    token_secret: localStorage.getItem("osm_token_secret"),
  };
};

const clearAuth = () => {
  localStorage.removeItem("osm_token");
  localStorage.removeItem("osm_token_secret");
};
