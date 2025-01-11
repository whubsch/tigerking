interface Bounds {
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}

export interface Coordinate {
  lat: number;
  lon: number;
}

export interface Tags {
  alt_name?: string;
  highway?: string;
  maxspeed?: string;
  name?: string;
  ref?: string;
  lanes?: string;
  surface?: string;
  oneway?: string;
  "lanes:forward"?: string;
  "lanes:backward"?: string;
  "tiger:cfcc"?: string;
  "tiger:county"?: string;
  "tiger:name_base"?: string;
  "tiger:name_base_1"?: string;
  "tiger:name_type"?: string;
  "tiger:reviewed"?: string;
  [key: string]: string | undefined; // Allow for other potential tags
}

export interface OsmWay {
  type: "way";
  id: number;
  bounds: Bounds;
  nodes: number[];
  geometry: Coordinate[];
  tags: Tags;
  version: number;
  user: string;
}

export interface OsmAuthOptions {
  url: string;
  oauth_consumer_key: string;
  oauth_secret: string;
  oauth_token?: string;
  oauth_token_secret?: string;
  singlepage?: boolean;
}

export interface OsmUser {
  id: string;
  display_name: string;
}

export interface ZxyTileType {
  zoom: number;
  x: number;
  y: number;
  hasParams: boolean;
}
