import { OsmWay } from "../objects";

const BASE_OVERPASS_QUERY = `
(
  way(area.hood)[highway]["tiger:reviewed"=no][!surface][!"fixme:tigerking"];
  way(area.hood)[highway]["tiger:reviewed"=no][!lanes][!"fixme:tigerking"];
)->.tigers;

(
  way(area.hood)[highway=service];
  way(area.hood)[highway=cycleway];
  way(area.hood)[highway=footway];
  way(area.hood)[highway=proposed];
  way(area.hood)[highway=track];
  way(area.hood)[highway=path];
)->.ignore;

((.tigers; - .ignore;); >; )->.all;
way.all->._;

out meta geom;
`;

interface OverpassResponse {
  elements: any[];
  // Add other response properties as needed
}

const isOsmWay = (element: any): element is OsmWay => {
  return element.type === "way";
};

export const overpassService = {
  async fetchWaysInArea(query: string): Promise<OsmWay[]> {
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
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
    const query =
      `
[out:json][bbox:${bbox.join(",")}];
      ` + BASE_OVERPASS_QUERY;
    return overpassService.fetchWaysInArea(query.replaceAll("(area.hood)", ""));
  },
  /**
   * Fetches ways within a relation that need surface tags
   * @param relationId - OSM relation ID
   * @returns Promise<OsmWay[]> - Array of ways
   */
  async fetchWaysInRelation(relationId: string): Promise<OsmWay[]> {
    const query =
      `
[out:json];
rel(${relationId});
map_to_area->.hood;
      ` + BASE_OVERPASS_QUERY;
    return overpassService.fetchWaysInArea(query);
  },
};
