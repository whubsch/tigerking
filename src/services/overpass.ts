import { OsmWay } from "../objects";
import { useSettingsStore } from "../stores/useSettingsStore";

// Function to generate the overpass query based on settings
const generateOverpassQuery = (includeTracksParam?: boolean): string => {
  // If a parameter is provided, use it; otherwise get from store
  // We need this parameter option for server-side or initial renders
  const includeTracks =
    includeTracksParam ?? useSettingsStore.getState().includeTracks;

  // Base query that includes all highway ways with tiger:reviewed=no
  const baseQuery = `
(
  way(area.hood)[highway]["tiger:reviewed"=no][!"fixme:tigerking"];
)->.tigers;

(
  way(area.hood)[highway=service];
  way(area.hood)[highway=cycleway];
  way(area.hood)[highway=footway];
  way(area.hood)[highway=proposed];
  ${!includeTracks ? "way(area.hood)[highway=track];" : ""}
  way(area.hood)[highway=path];
)->.ignore;

((.tigers; - .ignore;); >; )->.all;
way.all->._;

out meta geom;
`;

  return baseQuery;
};

// Function to generate query that returns only way IDs (without geometry)
const generateOverpassIdOnlyQuery = (includeTracksParam?: boolean): string => {
  // If a parameter is provided, use it; otherwise get from store
  const includeTracks =
    includeTracksParam ?? useSettingsStore.getState().includeTracks;

  // Base query that includes all highway ways with tiger:reviewed=no
  const baseQuery = `
(
  way(area.hood)[highway]["tiger:reviewed"=no][!"fixme:tigerking"];
)->.tigers;

(
  way(area.hood)[highway=service];
  way(area.hood)[highway=cycleway];
  way(area.hood)[highway=footway];
  way(area.hood)[highway=proposed];
  ${!includeTracks ? "way(area.hood)[highway=track];" : ""}
  way(area.hood)[highway=path];
)->.ignore;

((.tigers; - .ignore;);)->.all;

out ids;
`;

  return baseQuery;
};

interface OverpassResponse {
  elements: OsmWay[];
  // Add other response properties as needed
}

const isOsmWay = (element: unknown): element is OsmWay => {
  return (
    typeof element === "object" &&
    element !== null &&
    (element as Record<string, unknown>).type === "way"
  );
};

export const overpassService = {
  async fetchQuery(query: string): Promise<OsmWay[]> {
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "User-Agent": "TIGER King",
          Referer: "https://whubsch.github.io/tigerking/",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OverpassResponse = await response.json();
      return data.elements.filter(isOsmWay);
    } catch (error) {
      console.error("Error fetching from Overpass API:", error);
      throw error; // Re-throw to handle in component
    }
  },
  async fetchWaysInBbox(bbox: number[]): Promise<OsmWay[]> {
    // Get current includeTracks setting
    const includeTracks = useSettingsStore.getState().includeTracks;
    const query =
      `
[out:json][bbox:${bbox.join(",")}];
      ` + generateOverpassQuery(includeTracks);
    return overpassService.fetchQuery(query.replaceAll("(area.hood)", ""));
  },
  /**
   * Fetches ways within a relation that need surface tags
   * @param relationId - OSM relation ID
   * @returns Promise<OsmWay[]> - Array of ways
   */
  async fetchWaysInRelation(relationId: string): Promise<OsmWay[]> {
    // Get current includeTracks setting
    const includeTracks = useSettingsStore.getState().includeTracks;
    const query =
      `
[out:json];
rel(${relationId});
map_to_area->.hood;
      ` + generateOverpassQuery(includeTracks);
    return overpassService.fetchQuery(query);
  },

  async fetchWays(wayIds: string[]): Promise<OsmWay[]> {
    const query = `
[out:json];
way(id:${wayIds.join(",")});
out meta geom;
      `;
    return overpassService.fetchQuery(query);
  },

  /**
   * Fetches only way IDs in a bounding box (without geometry)
   * Much faster than fetching full geometry
   * @param bbox - [south, west, north, east]
   * @returns Promise<number[]> - Array of way IDs
   */
  async fetchWayIdsInBbox(bbox: number[]): Promise<number[]> {
    const includeTracks = useSettingsStore.getState().includeTracks;
    const query =
      `
[out:json][bbox:${bbox.join(",")}];
      ` + generateOverpassIdOnlyQuery(includeTracks);
    const wayData = await overpassService.fetchQuery(
      query.replaceAll("(area.hood)", ""),
    );
    // The query returns ways, extract just the IDs
    return wayData.map((way) => way.id);
  },

  /**
   * Fetches only way IDs within a relation (without geometry)
   * Much faster than fetching full geometry
   * @param relationId - OSM relation ID
   * @returns Promise<number[]> - Array of way IDs
   */
  async fetchWayIdsInRelation(relationId: string): Promise<number[]> {
    const includeTracks = useSettingsStore.getState().includeTracks;
    const query =
      `
[out:json];
rel(${relationId});
map_to_area->.hood;
      ` + generateOverpassIdOnlyQuery(includeTracks);
    const wayData = await overpassService.fetchQuery(query);
    // The query returns ways, extract just the IDs
    return wayData.map((way) => way.id);
  },
};
