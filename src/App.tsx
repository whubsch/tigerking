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
import HelpModal from "./components/HelpModal";
import { overpassService } from "./services/overpass";
import { shuffleArray } from "./services/shuffle";
import useWayManagement from "./hooks/useWayManagement";
import ErrorModal from "./components/ErrorModal";
import { OsmWay, Tags } from "./objects";
import { useChangesetStore } from "./stores/useChangesetStore";
import { useWayTagsStore } from "./stores/useWayTagsStore";
import { useBBoxStore } from "./stores/useBboxStore";
import { useWayStore } from "./stores/useWayStore";
import { getMapParams } from "./services/params";

const App: React.FC = () => {
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [latestChangeset, setLatestChangeset] = useState<number>(0);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isRelationLoading, setIsRelationLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showLaneDirection, setShowLaneDirection] = useState(false);
  const [convertDriveway, setConvertDriveway] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { relationId, setHost, setSource, setDescription } =
    useChangesetStore();
  const {
    lanes,
    setLanes,
    surface,
    setSurface,
    laneMarkings,
    setLaneMarkings,
    lanesForward,
    lanesBackward,
    setLanesForward,
    setLanesBackward,
    resetTags,
  } = useWayTagsStore();
  const { bboxState, updateFromZXY } = useBBoxStore();
  const { params, isBoundingBox } = useMemo(
    () => getMapParams(window.location.search),
    [],
  );

  // Get search parameters from URL
  useEffect(() => {
    if (isBoundingBox) {
      updateFromZXY({
        zoom: Number(params.zoom),
        x: Number(params.x),
        y: Number(params.y),
      });
    }
  }, [updateFromZXY, isBoundingBox, params]);

  useEffect(() => {
    setHost(
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname,
    );
  }, [setHost]);

  const { currentWayCoordinates } = useWayManagement();
  const {
    overpassWays,
    currentWay,
    uploadWays,
    setOverpassWays,
    setCurrentWay,
    setUploadWays,
    addToUpload,
  } = useWayStore();

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
        setLaneMarkings(false);
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
      setConvertDriveway("");
    }
  }, [
    currentWay,
    overpassWays,
    setLanes,
    setSurface,
    setCurrentWay,
    setLanesBackward,
    setLanesForward,
    setLaneMarkings,
  ]);

  const handleEnd = useCallback(() => {
    if (currentWay < overpassWays.length - 1) {
      resetTags();
      setCurrentWay(currentWay + 1);
    } else {
      setShowFinishedModal(true);
    }
  }, [
    currentWay,
    overpassWays.length,
    setCurrentWay,
    setShowFinishedModal,
    resetTags,
  ]);

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRelationHeading(true);
    setIsRelationLoading(true);

    try {
      const ways = await overpassService.fetchWaysInRelation(relationId);
      if (ways.length === 0) {
        setError("No ways found in bounding box");
      } else {
        setOverpassWays([]);
        setCurrentWay(0);

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
        addToUpload(updatedWay);
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
        addToUpload(updatedWay);
        handleEnd();
      },
      submit: () => {
        const updatedWay: OsmWay = {
          ...overpassWays[currentWay],
          tags: {
            ...filterTigerTags(overpassWays[currentWay].tags),
            surface: surface,
            ...(lanes ? { lanes: lanes } : {}),
            ...(!laneMarkings ? { lane_markings: "no" } : {}),
            ...(lanesForward
              ? { "lanes:forward": lanesForward.toString() }
              : {}),
            ...(lanesBackward
              ? { "lanes:backward": lanesBackward.toString() }
              : {}),
            ...(convertDriveway === "driveway"
              ? { highway: "service", service: "driveway" }
              : convertDriveway === "track"
                ? { highway: "track" }
                : {}),
          },
        };
        console.info("Submitted way:", updatedWay);
        addToUpload(updatedWay);
        handleEnd();
      },
    }),
    [
      setLanes,
      setSurface,
      handleEnd,
      overpassWays,
      currentWay,
      filterTigerTags,
      surface,
      lanes,
      lanesForward,
      lanesBackward,
      convertDriveway,
      laneMarkings,
      addToUpload,
    ],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle keypress if no modifiers are pressed
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // Only handle keypress if not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;

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
  }, [handleActions, lanes, surface, setShowFinishedModal]);

  return (
    <div className="flex flex-col md:h-screen">
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
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
        setShowFinishedModal={setShowFinishedModal}
        setShowHelpModal={setShowHelpModal}
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
