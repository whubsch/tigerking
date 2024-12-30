import { useState, useMemo } from "react";
import { OsmWay } from "../objects";

const useWayManagement = () => {
  const [overpassWays, setOverpassWays] = useState<OsmWay[]>([]);
  const [currentWay, setCurrentWay] = useState<number>(0);
  const [uploadWays, setUploadWays] = useState<OsmWay[]>([]);

  const addToUpload = (way: OsmWay) => {
    setUploadWays((prevWays) => [...prevWays, way]);
  };

  const resetWays = () => {
    setOverpassWays([]);
    setCurrentWay(0);
    setUploadWays([]);
  };

  const currentWayCoordinates = useMemo(
    () =>
      overpassWays[currentWay]?.geometry.map(
        (coord) => [coord.lon, coord.lat] as [number, number],
      ) || [],
    [overpassWays, currentWay],
  );

  return {
    overpassWays,
    setOverpassWays,
    currentWay,
    setCurrentWay,
    uploadWays,
    setUploadWays,
    addToUpload,
    resetWays,
    currentWayCoordinates,
  };
};

export default useWayManagement;
