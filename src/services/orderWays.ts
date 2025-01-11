import { OsmWay, Coordinate } from "../objects";

export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid mutating the original
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export function sortWaysByDistance(
  ways: OsmWay[],
  coordinate: Coordinate,
): OsmWay[] {
  // Helper function to calculate the center point of a way's bounds
  const getWayCenter = (way: OsmWay): Coordinate => ({
    lat: (way.bounds.minlat + way.bounds.maxlat) / 2,
    lon: (way.bounds.minlon + way.bounds.maxlon) / 2,
  });

  // Helper function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    coord1: Coordinate,
    coord2: Coordinate,
  ): number => {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lon - coord1.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coord1.lat)) *
        Math.cos(deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Convert degrees to radians
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Create a copy of the array and sort it
  return [...ways].sort((a, b) => {
    const centerA = getWayCenter(a);
    const centerB = getWayCenter(b);

    const distanceA = calculateDistance(coordinate, centerA);
    const distanceB = calculateDistance(coordinate, centerB);

    return distanceA - distanceB;
  });
}
