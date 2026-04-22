import { useEffect, useState, useCallback } from "react";
import { useWayStore } from "../stores/useWayStore";
import { OsmWay } from "../objects";

interface UseWayManagementProps {
  getCurrentWayDetails?: () => Promise<OsmWay | null>;
}

const useWayManagement = ({
  getCurrentWayDetails,
}: UseWayManagementProps = {}) => {
  const { overpassWays, currentWay, wayIds, getCachedWay } = useWayStore();
  const [currentWayDetails, setCurrentWayDetails] = useState<OsmWay | null>(
    null,
  );
  const [isLoadingWay, setIsLoadingWay] = useState(false);

  // Load current way details when current way changes
  useEffect(() => {
    const loadCurrentWay = async () => {
      // If wayIds are being used (lazy loading)
      if (wayIds.length > 0) {
        if (currentWay < 0 || currentWay >= wayIds.length) {
          setCurrentWayDetails(null);
          return;
        }

        const wayId = wayIds[currentWay];

        // Try to get from cache first
        const cached = getCachedWay(wayId);
        if (cached) {
          setCurrentWayDetails(cached);
          return;
        }

        // If getCurrentWayDetails callback is provided, use it
        if (getCurrentWayDetails) {
          setIsLoadingWay(true);
          try {
            const way = await getCurrentWayDetails();
            setCurrentWayDetails(way);
          } catch (error) {
            console.error("Error loading current way:", error);
            setCurrentWayDetails(null);
          } finally {
            setIsLoadingWay(false);
          }
        }
      } else if (
        overpassWays.length > 0 &&
        currentWay >= 0 &&
        currentWay < overpassWays.length
      ) {
        // Fallback to overpassWays if available (backward compatibility)
        setCurrentWayDetails(overpassWays[currentWay]);
      } else {
        setCurrentWayDetails(null);
      }
    };

    loadCurrentWay();
  }, [currentWay, wayIds, getCachedWay, getCurrentWayDetails, overpassWays]);

  const currentWayCoordinates = useCallback(() => {
    return (
      currentWayDetails?.geometry.map(
        (coord) => [coord.lon, coord.lat] as [number, number],
      ) || []
    );
  }, [currentWayDetails]);

  return {
    currentWayCoordinates: currentWayCoordinates(),
    currentWayDetails,
    isLoadingWay,
  };
};

export default useWayManagement;
