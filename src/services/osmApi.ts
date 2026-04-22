import { OsmWay, Coordinate } from "../objects";

interface ElementDetails {
  tags: Record<string, string>;
  id: number;
  type: string;
}

/**
 * Parse XML response from OSM API /full endpoint
 * Returns way with complete geometry from node coordinates
 */
const parseOsmXmlWay = (xmlText: string): OsmWay | null => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  // Check for parsing errors
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    console.error("XML parsing error");
    return null;
  }

  // Get the way element
  const wayElements = xmlDoc.getElementsByTagName("way");
  if (wayElements.length === 0) {
    return null;
  }

  const wayElement = wayElements[0];
  const wayId = parseInt(wayElement.getAttribute("id") || "0");
  const version = parseInt(wayElement.getAttribute("version") || "1");
  const user = wayElement.getAttribute("user") || "unknown";

  // Parse tags
  const tags: Record<string, string> = {};
  const tagElements = wayElement.getElementsByTagName("tag");
  for (let i = 0; i < tagElements.length; i++) {
    const tagEl = tagElements[i];
    const key = tagEl.getAttribute("k");
    const value = tagEl.getAttribute("v");
    if (key && value) {
      tags[key] = value;
    }
  }

  // Get node references from way
  const nodeRefs: number[] = [];
  const ndElements = wayElement.getElementsByTagName("nd");
  for (let i = 0; i < ndElements.length; i++) {
    const ref = parseInt(ndElements[i].getAttribute("ref") || "0");
    if (ref) {
      nodeRefs.push(ref);
    }
  }

  // Build a map of node ID -> coordinates
  const nodeCoords: Map<number, { lat: number; lon: number }> = new Map();
  const nodeElements = xmlDoc.getElementsByTagName("node");
  for (let i = 0; i < nodeElements.length; i++) {
    const nodeEl = nodeElements[i];
    const nodeId = parseInt(nodeEl.getAttribute("id") || "0");
    const lat = parseFloat(nodeEl.getAttribute("lat") || "0");
    const lon = parseFloat(nodeEl.getAttribute("lon") || "0");

    if (nodeId && lat !== 0 && lon !== 0) {
      nodeCoords.set(nodeId, { lat, lon });
    }
  }

  // Build geometry array in the order of node references
  const geometry: Coordinate[] = [];
  let minLat = 90,
    maxLat = -90,
    minLon = 180,
    maxLon = -180;

  for (const nodeId of nodeRefs) {
    const coord = nodeCoords.get(nodeId);
    if (coord) {
      geometry.push(coord);
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLon = Math.min(minLon, coord.lon);
      maxLon = Math.max(maxLon, coord.lon);
    }
  }

  const osmWay: OsmWay = {
    type: "way",
    id: wayId,
    bounds: {
      minlat: minLat,
      minlon: minLon,
      maxlat: maxLat,
      maxlon: maxLon,
    },
    nodes: nodeRefs,
    geometry: geometry,
    tags: tags,
    version: version,
    user: user,
  };

  return osmWay;
};

export const fetchElementTags = async (id: string, elementType: string) => {
  if (!id) {
    throw new Error("No ID provided");
  }

  try {
    const response = await fetch(
      `https://api.openstreetmap.org/api/0.6/${elementType}/${id}.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const elementData = data.elements[0] as ElementDetails;

    if (elementData && elementData.tags) {
      return elementData;
    } else {
      throw new Error(`No tags found for this ${elementType}`);
    }
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error(`Failed to fetch ${elementType} tags`);
  }
};

/**
 * Fetches full way details from OSM API /full endpoint
 * Returns way with complete geometry from all node coordinates
 *
 * The /full endpoint returns:
 * - The way itself
 * - All nodes referenced by the way (with coordinates)
 *
 * This is perfect for lazy loading because:
 * - Single API call
 * - Complete geometry included
 * - No need for additional node fetches
 *
 * @param wayId - The OSM way ID
 * @returns Promise<OsmWay> - Full way object with geometry
 */
export const fetchWayFromApi = async (
  wayId: number | string,
): Promise<OsmWay> => {
  if (!wayId) {
    throw new Error("No way ID provided");
  }

  try {
    const response = await fetch(
      `https://api.openstreetmap.org/api/0.6/way/${wayId}/full`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Way not found");
      } else if (response.status === 410) {
        throw new Error("Way has been deleted");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const osmWay = parseOsmXmlWay(xmlText);

    if (!osmWay) {
      throw new Error("Failed to parse way data from XML");
    }

    return osmWay;
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error(`Failed to fetch way ${wayId}`);
  }
};

/**
 * Fetches multiple ways from OSM API /full endpoint
 * Makes individual requests for each way (respects rate limits)
 *
 * @param wayIds - Array of OSM way IDs
 * @param delayMs - Delay between requests in milliseconds (default: 100ms)
 * @returns Promise<OsmWay[]> - Array of way objects with geometry
 */
export const fetchWaysFromApi = async (
  wayIds: (number | string)[],
  delayMs: number = 100,
): Promise<OsmWay[]> => {
  if (!wayIds || wayIds.length === 0) {
    throw new Error("No way IDs provided");
  }

  const ways: OsmWay[] = [];

  for (let i = 0; i < wayIds.length; i++) {
    try {
      const way = await fetchWayFromApi(wayIds[i]);
      ways.push(way);

      // Add delay between requests to respect API rate limits
      // (except for the last request)
      if (i < wayIds.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Error fetching way ${wayIds[i]}:`, error);
      // Continue with next way instead of throwing
    }
  }

  return ways;
};
