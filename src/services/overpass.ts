import { OsmWay } from "../objects";

interface OverpassResponse {
  elements: any[];
  // Add other response properties as needed
}

const isOsmWay = (element: any): element is OsmWay => {
  return element.type === "way";
};

export const overpassService = {
  /**
   * Fetches ways within a relation that need surface tags
   * @param relationId - OSM relation ID
   * @returns Promise<OsmWay[]> - Array of ways
   */
  async fetchWaysInRelation(relationId: string): Promise<OsmWay[]> {
    const query = `
      [out:json][maxsize:1048576]; // limit response size to 100 MB
      rel(${relationId});
      map_to_area->.hood;
      (way(area.hood)[highway][name]["tiger:reviewed"=no][!surface];);
      out meta geom;
    `;

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
};
