import React, { useEffect, useState } from "react";
import WayMap from "./components/WayMap";
import MainNavbar from "./components/Navbar";

import "maplibre-gl/dist/maplibre-gl.css";
import LeftPane from "./components/LeftPane";
import ChangesetModal from "./components/ChangesetModal";
import FinishedModal from "./components/FinishedModal";
import { useOsmAuthContext } from "./contexts/useOsmAuth";
import { overpassService } from "./services/overpass";
import { shuffleArray } from "./services/shuffle";
import useWayManagement from "./hooks/useWayManagement";
import ErrorModal from "./components/ErrorModal";
import { OsmWay } from "./objects";

const App: React.FC = () => {
  const [surface, setSurface] = useState<string>("");
  const [lanes, setLanes] = useState<string>(""); // Add this line
  const [relationId, setRelationId] = useState<string>("");
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [latestChangeset, setLatestChangeset] = useState<number>(0);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isRelationLoading, setIsRelationLoading] = useState(false);
  const [imagery, setImagery] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showLaneDirection, setShowLaneDirection] = useState(false);
  const [lanesForward, setLanesForward] = useState(0);
  const [lanesBackward, setLanesBackward] = useState(0);
  const [convertDriveway, setConvertDriveway] = useState(false);
  const { loading } = useOsmAuthContext();

  const {
    overpassWays,
    setOverpassWays,
    currentWay,
    setCurrentWay,
    uploadWays,
    setUploadWays,
    currentWayCoordinates,
  } = useWayManagement();

  // Add this useEffect
  useEffect(() => {
    if (overpassWays.length > 0 && overpassWays[currentWay]) {
      const currentWayTags = overpassWays[currentWay].tags;

      // Set surface if it exists
      if (currentWayTags.surface) {
        setSurface(currentWayTags.surface);
      } else {
        setSurface("");
      }

      // Set lanes if it exists
      if (currentWayTags.lanes) {
        setLanes(currentWayTags.lanes);
      } else if (currentWayTags.lane_markings === "no") {
        setLanes("none");
      } else {
        setLanes("");
      }

      // Set lane forward and backward if it exists
      if (currentWayTags["lanes:forward"]) {
        setLanesForward(Number(currentWayTags["lanes:forward"]));
      } else {
        setLanesForward(0);
      }

      // Set lane forward and backward if it exists
      if (currentWayTags["lanes:backward"]) {
        setLanesBackward(Number(currentWayTags["lanes:backward"]));
      } else {
        setLanesBackward(0);
      }

      setShowLaneDirection(false);
      setConvertDriveway(false);
    }
  }, [currentWay, overpassWays]);

  const handleEnd = () => {
    if (currentWay < overpassWays.length - 1) {
      setCurrentWay(currentWay + 1);
    } else {
      setShowFinishedModal(true);
    }
  };

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRelationHeading(true);
    setIsRelationLoading(true);

    try {
      const ways = await overpassService.fetchWaysInRelation(relationId);
      const shuffledWays = shuffleArray(ways);
      setOverpassWays(shuffledWays);
      console.log("Ways:", ways);
      if (ways.length === 0) {
        setError("No ways found in relation");
      }
    } catch (error) {
      setError("Error fetching OSM data: " + error);
      // Handle error in UI (maybe set an error state)
    } finally {
      setIsRelationLoading(false); // Set loading to false when done
    }
  };

  const handleActions = {
    skip: () => {
      setLanes("");
      setSurface("");
      handleEnd();
    },
    fix: (message: string) => {
      const updatedWay = {
        ...overpassWays[currentWay],
        tags: {
          ...overpassWays[currentWay].tags,
          "fixme:tigerking": message,
        },
      };
      setUploadWays((prevWays) => [...prevWays, updatedWay]);
      handleEnd();
    },
    submit: () => {
      const updatedWay: OsmWay = {
        ...overpassWays[currentWay],
        tags: {
          ...overpassWays[currentWay].tags,
          surface: surface,
          ...(lanes === "none" ? { lane_markings: "no" } : { lanes: lanes }),
          ...(lanesForward ? { "lanes:forward": lanesForward.toString() } : {}),
          ...(lanesBackward
            ? { "lanes:backward": lanesBackward.toString() }
            : {}),
          ...(convertDriveway
            ? { highway: "service", service: "driveway" }
            : {}),
        },
      };
      console.log("Updated way:", updatedWay);
      setUploadWays((prevWays) => [...prevWays, updatedWay]);
      handleEnd();
    },
  };

  return (
    <div className="flex flex-col md:h-screen">
      <ErrorModal
        isOpen={Boolean(error)}
        onClose={() => setError("")}
        message={error}
      />
      <ChangesetModal
        latestChangeset={latestChangeset}
        onClose={() => setLatestChangeset(0)}
        imagery={imagery}
      />
      <FinishedModal
        show={showFinishedModal && !latestChangeset}
        ways={overpassWays.length}
        onClose={() => setShowFinishedModal(false)}
        uploads={uploadWays}
        setUploadWays={setUploadWays}
        location={location}
        setChangeset={setLatestChangeset}
        imagery={imagery}
        setError={setError}
      />
      <MainNavbar
        uploads={uploadWays}
        setUploadWays={setUploadWays}
        location={location}
        setChangeset={setLatestChangeset}
        imagery={imagery}
        setError={setError}
      />
      <div className="flex flex-col md:flex-row flex-1 bg-background overflow-auto">
        <LeftPane
          relationId={relationId}
          showRelationHeading={showRelationHeading}
          overpassWays={overpassWays}
          currentWay={currentWay}
          isLoading={isRelationLoading}
          surfaceKeys={surface}
          lanesKeys={lanes}
          onSurfaceChange={setSurface}
          setLanes={setLanes}
          showLaneDirection={showLaneDirection}
          setShowLaneDirection={setShowLaneDirection}
          lanesForward={lanesForward}
          setLanesForward={setLanesForward}
          lanesBackward={lanesBackward}
          setLanesBackward={setLanesBackward}
          convertDriveway={convertDriveway}
          setConvertDriveway={setConvertDriveway}
          onSkip={handleActions.skip}
          onFix={handleActions.fix}
          onSubmit={handleActions.submit}
          loading={loading}
          setLocation={setLocation}
          setRelationId={setRelationId}
          handleRelationSubmit={handleRelationSubmit}
        />
        <div className="w-full flex md:flex-1 h-[600px] md:h-auto p-4">
          <WayMap
            coordinates={currentWayCoordinates}
            setImagery={setImagery}
            zoom={16}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
