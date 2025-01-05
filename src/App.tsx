import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import WayMap from "./components/WayMap";
import MainNavbar from "./components/Navbar";

import "maplibre-gl/dist/maplibre-gl.css";
import LeftPane from "./components/LeftPane";
import ChangesetModal from "./components/ChangesetModal";
import FinishedModal from "./components/FinishedModal";
import { overpassService } from "./services/overpass";
import { shuffleArray } from "./services/shuffle";
import useWayManagement from "./hooks/useWayManagement";
import ErrorModal from "./components/ErrorModal";
import { OsmWay, Tags } from "./objects";
import { useChangesetStore } from "./stores/useChangesetStore";
import { useWayTagsStore } from "./stores/useWayTagsStore";
import { useBBoxStore } from "./stores/useBboxStore";

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
  const { relationId, setHost, setSource, setDescription } =
    useChangesetStore();
  const { lanes, setLanes, surface, setSurface } = useWayTagsStore();
  const { bboxState, updateFromZXY } = useBBoxStore();

  // Get search parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const zoom = searchParams.get("zoom");
    const lon = searchParams.get("x");
    const lat = searchParams.get("y");

    if (zoom && lat && lon) {
      updateFromZXY({
        zoom: Number(zoom),
        x: Number(lon),
        y: Number(lat),
      });
    }
  }, [updateFromZXY]);

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

  const uploadWaysRef = useRef(uploadWays);

  // Update ref whenever uploadWays changes
  useEffect(() => {
    uploadWaysRef.current = uploadWays;
  }, [uploadWays]);

  const deduplicateNewWays = useCallback(
    (ways: OsmWay[]) => {
      const unprocessedWays = ways.filter(
        (way) =>
          !uploadWaysRef.current.some(
            (uploadedWay) => uploadedWay.id === way.id,
          ),
      );
      const shuffledWays = shuffleArray(unprocessedWays);
      setOverpassWays(shuffledWays);
    },
    [], // No dependencies needed
  );

  useEffect(() => {
    const fetchWaysInBoundingBox = async () => {
      if (
        bboxState.north &&
        bboxState.south &&
        bboxState.east &&
        bboxState.west
      ) {
        setIsRelationLoading(true);
        try {
          const ways = await overpassService.fetchWaysInBbox([
            bboxState.south,
            bboxState.west,
            bboxState.north,
            bboxState.east,
          ]);

          if (ways.length === 0) {
            setError("No ways found in bounding box");
          } else {
            deduplicateNewWays(ways);
          }
        } catch (error) {
          setError("Error fetching OSM data: " + error);
        } finally {
          setIsRelationLoading(false);
        }
      }
    };

    fetchWaysInBoundingBox();
  }, [bboxState, deduplicateNewWays]);

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
  }, [setDescription, setUploadWays]);

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

  // Handle current way and tags
  useEffect(() => {
    if (overpassWays.length > 0 && overpassWays[currentWay]) {
      // Check and skipping if way is already in uploadWays

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
  }, [
    currentWay,
    overpassWays,
    setLanes,
    setSurface,
    setCurrentWay,
    uploadWays,
  ]);

  const handleEnd = useCallback(() => {
    if (currentWay < overpassWays.length - 1) {
      setCurrentWay(currentWay + 1);
    } else {
      setShowFinishedModal(true);
    }
  }, [currentWay, overpassWays.length, setCurrentWay, setShowFinishedModal]);

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRelationHeading(true);
    setIsRelationLoading(true);

    try {
      const ways = await overpassService.fetchWaysInRelation(relationId);
      if (ways.length === 0) {
        setError("No ways found in bounding box");
      } else {
        deduplicateNewWays(ways);
      }
    } catch (error) {
      setError("Error fetching OSM data: " + error);
      // Handle error in UI (maybe set an error state)
    } finally {
      setIsRelationLoading(false); // Set loading to false when done
    }
  };

  const filterTigerTags = useCallback(
    (tags: Tags, keepReviewed: boolean = false): Tags => {
      return Object.fromEntries(
        Object.entries(tags).filter(([key]) =>
          keepReviewed
            ? !key.startsWith("tiger") || key === "tiger:reviewed"
            : !key.startsWith("tiger"),
        ),
      );
    },
    [],
  );

  const handleActions = useMemo(
    () => ({
      skip: () => {
        console.log("Skipped way");
        setLanes("");
        setSurface("");
        handleEnd();
      },
      fix: (message: string) => {
        const updatedWay = {
          ...overpassWays[currentWay],
          tags: {
            ...filterTigerTags(overpassWays[currentWay].tags, true),
            "fixme:tigerking": message,
          },
        };
        console.info("Fixed way:", updatedWay);
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
        console.info("Updated way:", updatedWay);
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
            ...(lanesForward
              ? { "lanes:forward": lanesForward.toString() }
              : {}),
            ...(lanesBackward
              ? { "lanes:backward": lanesBackward.toString() }
              : {}),
            ...(convertDriveway
              ? { highway: "service", service: "driveway" }
              : {}),
          },
        };
        console.info("Submitted way:", updatedWay);
        setUploadWays((prevWays) => [...prevWays, updatedWay]);
        handleEnd();
      },
    }),
    [
      setLanes,
      setSurface,
      handleEnd,
      overpassWays,
      currentWay,
      setUploadWays,
      filterTigerTags,
      surface,
      lanes,
      lanesForward,
      lanesBackward,
      convertDriveway,
    ],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "u") {
        setShowFinishedModal(true);
      } else if (event.key === "f") {
        handleActions.clearTiger();
      } else if (event.key === "s" && surface && lanes) {
        handleActions.submit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setShowFinishedModal, handleActions, lanes, surface]);

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
          bbox={bboxState}
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
