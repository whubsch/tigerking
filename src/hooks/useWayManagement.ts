import { useMemo } from "react";
import { useWayStore } from "../stores/useWayStore";

const useWayManagement = () => {
  const { overpassWays, currentWay } = useWayStore();

  const currentWayCoordinates = useMemo(
    () =>
      overpassWays[currentWay]?.geometry.map(
        (coord) => [coord.lon, coord.lat] as [number, number],
      ) || [],
    [overpassWays, currentWay],
  );

  return {
    currentWayCoordinates,
  };
};

export default useWayManagement;
