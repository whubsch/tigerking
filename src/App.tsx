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
import { OsmWay, Tags } from "./objects";
import { useChangesetStore } from "./stores/useChangesetStore";
import { useWayTagsStore } from "./stores/useWayTagsStore";

const App: React.FC = () => {
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [latestChangeset, setLatestChangeset] = useState<number>(0);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isRelationLoading, setIsRelationLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showLaneDirection, setShowLaneDirection] = useState(false);
  const [lanesForward, setLanesForward] = useState(0);
  const [lanesBackward, setLanesBackward] = useState(0);
  const [convertDriveway, setConvertDriveway] = useState(false);
  const { loading } = useOsmAuthContext();
  const { relationId, setHost, setSource, setDescription } =
    useChangesetStore();
  const { lanes, setLanes, surface, setSurface } = useWayTagsStore();

  // Should be inside a useEffect:
  useEffect(() => {
    setHost(
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname,
    );
  }, [setHost]); // Empty dependency array since this only needs to run once

  const {
    overpassWays,
    setOverpassWays,
    currentWay,
    setCurrentWay,
    uploadWays,
    setUploadWays,
    currentWayCoordinates,
  } = useWayManagement();

  const UPLOAD_WAYS_STORAGE_KEY = "tigerking_upload_ways";

  // Load saved ways when component mounts
  useEffect(() => {
    setDescription("");

    const savedWays = localStorage.getItem(UPLOAD_WAYS_STORAGE_KEY);
    if (savedWays) {
      try {
        const parsedWays = JSON.parse(savedWays);
        setUploadWays(parsedWays);
      } catch (e) {
        console.error("Error loading saved ways:", e);
      }
    }
  }, []);

  // Save ways whenever they change
  useEffect(() => {
    if (uploadWays.length > 0) {
      localStorage.setItem(UPLOAD_WAYS_STORAGE_KEY, JSON.stringify(uploadWays));
    }
  }, [uploadWays]);

  // Clear saved ways on upload or clear
  const clearSavedWays = () => {
    localStorage.removeItem(UPLOAD_WAYS_STORAGE_KEY);
  };

  const isWayProcessed = (wayId: number, toUploadWays: OsmWay[]): boolean => {
    return toUploadWays.some((way) => way.id === wayId);
  };

  // Handle current way and tags
  useEffect(() => {
    if (overpassWays.length > 0 && overpassWays[currentWay]) {
      // Check and skipping if way is already in uploadWays
      const currentWayId = overpassWays[currentWay].id;
      if (isWayProcessed(currentWayId, uploadWays)) {
        console.log(`Skipping already processed way ${currentWayId}`);
        setCurrentWay(currentWay + 1);
        return;
      }

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
  }, [currentWay, overpassWays, setLanes, setSurface]);

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

  const filterTigerTags = (tags: Tags): Tags => {
    return Object.fromEntries(
      Object.entries(tags).filter(([key]) => !key.startsWith("tiger")),
    );
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
    clearTiger: () => {
      const updatedWay = {
        ...overpassWays[currentWay],
        tags: {
          ...filterTigerTags(overpassWays[currentWay].tags),
        },
      };
      console.log("Updated way:", updatedWay);
      setUploadWays((prevWays) => [...prevWays, updatedWay]);
      handleEnd();
    },
    submit: () => {
      const updatedWay: OsmWay = {
        ...overpassWays[currentWay],
        tags: {
          ...filterTigerTags(overpassWays[currentWay].tags),
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
      />
      <FinishedModal
        show={showFinishedModal && !latestChangeset}
        ways={currentWay}
        onClose={() => setShowFinishedModal(false)}
        uploads={uploadWays}
        setUploadWays={(ways) => {
          setUploadWays(ways);
          if (ways.length === 0) {
            clearSavedWays();
          }
        }}
        setChangeset={setLatestChangeset}
        setError={setError}
      />
      <MainNavbar
        uploads={uploadWays}
        setUploadWays={setUploadWays}
        setChangeset={setLatestChangeset}
        setError={setError}
        setShowFinishedModal={setShowFinishedModal}
      />
      <div className="flex flex-col md:flex-row flex-1 bg-background overflow-auto">
        <LeftPane
          showRelationHeading={showRelationHeading}
          overpassWays={overpassWays}
          currentWay={currentWay}
          isLoading={isRelationLoading}
          showLaneDirection={showLaneDirection}
          setShowLaneDirection={setShowLaneDirection}
          convertDriveway={convertDriveway}
          setConvertDriveway={setConvertDriveway}
          onSkip={handleActions.skip}
          onFix={handleActions.fix}
          onClearTiger={handleActions.clearTiger}
          onSubmit={handleActions.submit}
          loading={loading}
          handleRelationSubmit={handleRelationSubmit}
        />
        <div className="w-full flex md:flex-1 h-[600px] md:h-auto p-4">
          <WayMap
            coordinates={currentWayCoordinates}
            setImagery={setSource}
            zoom={16}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
