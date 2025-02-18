import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { Feature, FeatureCollection, Polygon } from "geojson";
import { point } from "@turf/helpers";

export interface Attribution {
  required?: boolean;
  text: string;
  url: string;
}

export interface TileSource {
  name: string;
  url: string;
  attribution: Attribution;
  maxZoom: number;
}

export interface TileSources {
  [key: string]: TileSource;
}

export interface AccumulatorType {
  countrywideSourcesMap: TileSources;
  otherSourcesMap: TileSources;
}

export function processImagerySources(imagery_json: {
  features: Array<{
    properties: {
      id: string;
      name: string;
      url: string;
      countrywide?: boolean;
      attribution?: {
        required?: boolean;
        text?: string;
        url?: string;
      };
      max_zoom?: number;
    };
  }>;
}): {
  TILE_SOURCES: TileSources;
  COUNTRYWIDE_TILE_SOURCES: TileSources;
  OTHER_TILE_SOURCES: TileSources;
} {
  const { countrywideSourcesMap, otherSourcesMap } =
    imagery_json.features.reduce<AccumulatorType>(
      (acc, feature) => {
        const { properties } = feature;
        const sourceObject = {
          name: properties.name,
          url: properties.url,
          attribution: {
            required: properties.attribution?.required || false,
            text: properties.attribution?.text || "OpenStreetMap contributors",
            url: properties.attribution?.url || "",
          },
          maxZoom: properties.max_zoom || 20,
        };

        if (properties.countrywide) {
          acc.countrywideSourcesMap[properties.id] = sourceObject;
        } else {
          acc.otherSourcesMap[properties.id] = sourceObject;
        }

        return acc;
      },
      { countrywideSourcesMap: {}, otherSourcesMap: {} },
    );

  const TILE_SOURCES: TileSources = {
    ...countrywideSourcesMap,
    ...otherSourcesMap,
  };

  const COUNTRYWIDE_TILE_SOURCES: TileSources = countrywideSourcesMap;
  const OTHER_TILE_SOURCES: TileSources = otherSourcesMap;

  return {
    TILE_SOURCES,
    COUNTRYWIDE_TILE_SOURCES,
    OTHER_TILE_SOURCES,
  };
}

export function getDefaultImagerySourceId(tileSources: TileSources): string {
  return tileSources["EsriWorldImageryClarity"]
    ? "EsriWorldImageryClarity"
    : Object.keys(tileSources)[0] || "";
}

export function filterImageryLayersAtLocation(
  geojsonFeatures: FeatureCollection<Polygon, Feature["properties"]>,
  longitude: number,
  latitude: number,
): Feature[] {
  // Create a point from the given coordinates
  const pointObj = point([longitude, latitude]);

  // Filter features that contain the point
  const visibleFeatures = geojsonFeatures.features.filter((feature) => {
    if (!feature) {
      return false;
    } else if (!feature.geometry) {
      return true;
    }

    // Ensure the feature is a polygon
    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      return booleanPointInPolygon(pointObj, feature);
    }
    return false;
  });

  return visibleFeatures;
}
