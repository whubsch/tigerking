interface Bounds {
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}

interface Coordinate {
  lat: number;
  lon: number;
}

interface Tags {
  alt_name?: string;
  highway?: string;
  maxspeed?: string;
  name?: string;
  ref?: string;
  lanes?: string;
  surface?: string;
  oneway?: string;
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
  // Add other user properties as needed
}
