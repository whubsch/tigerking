// @ts-expect-error bad export from osm-auth
import { osmAuth } from "osm-auth";
import Cookies from "js-cookie";

import { OsmXhrOptions } from "../types/osm";

export const auth = osmAuth({
  client_id: "o8woB8nXRF1IbN4Bjwjc5EoSVWQiabhCDjqPyl4xUSk",
  redirect_uri: window.location.origin,
  scope: "read_prefs write_api",
  auto: true,
});

const authFetch = async (options: OsmXhrOptions) =>
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
  };
};

export const loginAndfetchOsmUser = async (): Promise<OsmUser> => {
  const osmUser = await fetchOsmUser();

  const { url } = auth.options();
  let osmAccessToken = localStorage.getItem(`${url}oauth2_access_token`);
  const osmUserForSSR = JSON.stringify(osmUser);
  osmAccessToken = osmAccessToken ?? "";
  Cookies.set("osmAccessToken", osmAccessToken, { path: "/", expires: 365 });
  Cookies.set("osmUserForSSR", osmUserForSSR, { path: "/", expires: 365 });

  await fetch("/api/token-login");

  return osmUser;
};

export const osmLogout = async () => {
  auth.logout();
  Cookies.remove("osmAccessToken", { path: "/" });
  Cookies.remove("osmUserForSSR", { path: "/" });
};
