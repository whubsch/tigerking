// @ts-expect-error bad export from osm-auth
import { osmAuth } from "osm-auth";
import Cookies from "js-cookie";

import { OsmXhrOptions } from "../types/osm";

export const auth = osmAuth({
  client_id: "o8woB8nXRF1IbN4Bjwjc5EoSVWQiabhCDjqPyl4xUSk",
  redirect_uri: window.location.origin + window.location.pathname,
  scope: "read_prefs write_api",
  auto: true,
  singlepage: true,
});

export const handleOAuthCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  if (code && state) {
    console.log("Handling OAuth callback", { code, state });
    try {
      const user = await fetchOsmUser();
      return user;
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      throw error;
    }
  }
  return null;
};

// Add a function to check auth state
export const checkAuthState = () => {
  const { url } = auth.options();
  const token = localStorage.getItem(`${url}oauth2_access_token`);
  console.log("Current auth state:", {
    hasToken: !!token,
    token: token,
  });
  return !!token;
};

export const authFetch = async (options: OsmXhrOptions) =>
  new Promise<any>((resolve, reject) => {
    auth.xhr(options, (err: Error, details: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(details);
    });
  });

export type OsmUser = {
  name: string;
  imageUrl: string;
  changesetCount: number;
};

export const fetchOsmUser = async (): Promise<OsmUser> => {
  const response = await authFetch({
    method: "GET",
    path: "/api/0.6/user/details.json",
  });
  const details = JSON.parse(response).user;
  return {
    name: details.display_name,
    imageUrl:
      details.img?.href ??
      `https://www.gravatar.com/avatar/${details.id}?s=24&d=robohash`,
    changesetCount: details.changesets?.count ?? -1,
  };
};

export const loginAndfetchOsmUser = async (): Promise<OsmUser> => {
  const osmUser = await fetchOsmUser();

  const { url } = auth.options();
  let osmAccessToken = localStorage.getItem(`${url}oauth2_access_token`);
  const osmUserForSSR = JSON.stringify(osmUser);
  osmAccessToken = osmAccessToken ?? "";

  console.log("Setting cookies:", {
    osmAccessToken,
    osmUserForSSR,
  });

  Cookies.set("osmAccessToken", osmAccessToken, { path: "/", expires: 365 });
  Cookies.set("osmUserForSSR", osmUserForSSR, { path: "/", expires: 365 });

  return osmUser;
};

export const osmLogout = async () => {
  auth.logout();
  Cookies.remove("osmAccessToken", { path: "/" });
  Cookies.remove("osmUserForSSR", { path: "/" });
};
