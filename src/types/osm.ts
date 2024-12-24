export interface OsmAuthConfig {
  client_id: string;
  redirect_uri: string;
  scope: string;
  auto: boolean;
  singlepage: boolean;
}

export interface OsmUser {
  id: string;
  display_name: string;
  account_created: string;
  // Add other user properties as needed
}

export interface OsmAuthInstance {
  xhr: (
    options: OsmXhrOptions,
    callback: (err: any, result: any) => void,
  ) => void;
  authenticate: (callback: () => void) => void;
  logout: () => void;
}

export interface OsmXhrOptions {
  method: string;
  path: string;
  headers?: Record<string, string>;
  content?: string;
  body?: string;
  options?: object;
}
