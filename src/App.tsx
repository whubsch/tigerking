import React, { useEffect, useState, useCallback, useMemo } from "react";
import WayMap from "./components/WayMap";
import Navbar from "./components/Navbar";

import "maplibre-gl/dist/maplibre-gl.css";
import LeftPane from "./components/LeftPane";
import ChangesetModal from "./components/modals/ChangesetModal";
import UploadModal from "./components/modals/UploadModal";
import HelpModal from "./components/modals/HelpModal";
import AreaCompletedModal from "./components/modals/AreaCompletedModal";
import { detectAbbreviatedStreetName } from "./components/TagFixAlert.utils";
import { overpassService } from "./services/overpass";
import { shuffleArray } from "./services/orderWays";
import useWayManagement from "./hooks/useWayManagement";
import ErrorModal from "./components/modals/ErrorModal";
import { OsmWay, Tags } from "./objects";
import { useChangesetStore } from "./stores/useChangesetStore";
import { useWayTagsStore } from "./stores/useWayTagsStore";
import { useBBoxStore } from "./stores/useBboxStore";
import { useWayStore } from "./stores/useWayStore";
import { useOsmAuthContext } from "./contexts/useOsmAuth";
import { getMapParams } from "./services/params";
import SettingsModal from "./components/modals/SettingsModal";
import { LazyWayFetcher } from "./services/lazyWayFetcher";

const App: React.FC = () => {
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [latestChangeset, setLatestChangeset] = useState<number>(0);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [isRelationLoading, setIsRelationLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showLaneDirection, setShowLaneDirection] = useState(false);
  const [convertDriveway, setConvertDriveway] = useState<string>("");
  const [nameFixAction, setNameFixAction] = useState<string>("check");
  const [streetAbbreviationAction, setStreetAbbreviationAction] =
    useState<string>("expand");
  const [laneTagFixAction, setLaneTagFixAction] = useState<string>("remove");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAreaCompletedModal, setShowAreaCompletedModal] = useState(false);
  const { relation, setRelation, setHost, setSource, resetDescription } =
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
  const { params, isBoundingBox, isCenterPoint } = useMemo(
    () => getMapParams(window.location.search),
    [],
  );

  const {
    overpassWays,
    currentWay,
    uploadWays,
    wayIds,
    setCurrentWay,
    setUploadWays,
    addToUpload,
    setCachedWay,
    getCachedWay,
    setWayIds,
    setIsFetchingNext,
  } = useWayStore();
  const [lazyFetcher, setLazyFetcher] = useState<LazyWayFetcher | null>(null);
  const { loggedIn } = useOsmAuthContext();

  useEffect(() => {
    resetDescription();
  }, [resetDescription]);

  // Individual tag processing functions
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

  const findNumberedNameTags = useCallback((tags: Tags) => {
    return Object.keys(tags)
      .filter((key) => /^name_\d+$/.test(key))
      .sort();
  }, []);

  const getNumberedNameTagToFix = useCallback(
    (tags: Tags) => {
      const numberedNameTags = findNumberedNameTags(tags);
      if (numberedNameTags.length === 1 && !tags.alt_name) {
        return numberedNameTags[0];
      }
      return null;
    },
    [findNumberedNameTags],
  );

  const applyLaneTagFixes = useCallback(
    (tags: Tags): Tags => {
      const currentWayTags = overpassWays[currentWay]?.tags;
      if (!currentWayTags) return tags;

      const updatedTags = { ...tags };

      // Remove lane tags on unpaved surfaces if action is "remove"
      if (laneTagFixAction === "remove") {
        delete updatedTags.lanes;
        delete updatedTags["lanes:forward"];
        delete updatedTags["lanes:backward"];
        delete updatedTags.lane_markings;
      }

      return updatedTags;
    },
    [overpassWays, currentWay, laneTagFixAction],
  );

  const applyNameFixes = useCallback(
    (tags: Tags): Tags => {
      const currentWayTags = overpassWays[currentWay]?.tags;
      if (!currentWayTags) return tags;

      const updatedTags = { ...tags };

      // Fix 1: Expand abbreviated street names
      if (streetAbbreviationAction === "expand") {
        const streetAbbreviation = detectAbbreviatedStreetName(
          currentWayTags.name,
        );
        if (streetAbbreviation) {
          updatedTags.name = streetAbbreviation.fullExpanded;
        }
      }

      // Fix 2: Remove or replace numbered name tags
      const tagToFix = getNumberedNameTagToFix(currentWayTags);
      if (tagToFix && nameFixAction !== "ban") {
        if (nameFixAction === "check") {
          updatedTags.alt_name = currentWayTags[tagToFix];
          delete updatedTags[tagToFix];
        } else if (nameFixAction === "trash") {
          delete updatedTags[tagToFix];
        }
      }

      return updatedTags;
    },
    [
      overpassWays,
      currentWay,
      nameFixAction,
      getNumberedNameTagToFix,
      streetAbbreviationAction,
    ],
  );

  const addDetailTags = useCallback((): Tags => {
    return {
      surface: surface,
      ...(lanes ? { lanes: lanes } : {}),
      ...(!laneMarkings ? { lane_markings: "no" } : {}),
      ...(lanesForward ? { "lanes:forward": lanesForward.toString() } : {}),
      ...(lanesBackward ? { "lanes:backward": lanesBackward.toString() } : {}),
      ...(convertDriveway === "driveway"
        ? { highway: "service", service: "driveway" }
        : convertDriveway
          ? { highway: convertDriveway }
          : {}),
    };
  }, [
    convertDriveway,
    laneMarkings,
    lanes,
    lanesBackward,
    lanesForward,
    surface,
  ]);

  // Master tag management function
  const processWayTags = useCallback(
    (
      originalTags: Tags,
      options: {
        keepTigerReviewed?: boolean;
        includeDetailTags?: boolean;
        includeFixmeMessage?: string;
      } = {},
    ): Tags => {
      const {
        keepTigerReviewed = false,
        includeDetailTags = false,
        includeFixmeMessage,
      } = options;

      // Start with original tags
      let processedTags = { ...originalTags };

      // Step 1: Filter TIGER tags
      processedTags = filterTigerTags(processedTags, keepTigerReviewed);

      // Step 2: Apply name fixes
      processedTags = applyNameFixes(processedTags);

      // Step 3: Apply lane tag fixes
      processedTags = applyLaneTagFixes(processedTags);

      // Step 4: Add fixme message if provided
      if (includeFixmeMessage) {
        processedTags["fixme:tigerking"] = includeFixmeMessage;
      }

      // Step 5: Add detail tags if requested
      if (includeDetailTags) {
        const detailTags = addDetailTags();
        processedTags = { ...processedTags, ...detailTags };
      }

      // Future tag processing functions can be added here
      // Step N: processedTags = applyNewTagFunction(processedTags);

      return processedTags;
    },
    [filterTigerTags, applyNameFixes, applyLaneTagFixes, addDetailTags],
  );

  const deduplicateNewWays = useCallback(
    (wayIds: number[], shuffle = true) => {
      // Filter way IDs by upload status
      const unprocessedWayIds = wayIds.filter(
        (wayId) => !uploadWays.some((uploadedWay) => uploadedWay.id === wayId),
      );

      // Shuffle if requested
      const processedWayIds = shuffle
        ? shuffleArray(unprocessedWayIds)
        : unprocessedWayIds;

      // Store the way IDs in the store
      setWayIds(processedWayIds);

      // Initialize the LazyWayFetcher with the way IDs
      const fetcher = new LazyWayFetcher({
        wayIds: processedWayIds,
        onWayLoaded: (way, wayId) => {
          setCachedWay(wayId, way);
        },
        onError: (error, wayId) => {
          console.error(`Error loading way ${wayId}:`, error);
        },
      });
      setLazyFetcher(fetcher);

      // Pre-fetch the first way for immediate data
      if (processedWayIds.length > 0) {
        fetcher.fetch(processedWayIds[0]).catch((error) => {
          console.error("Error pre-fetching first way:", error);
        });
      }
    },
    [uploadWays, setWayIds, setCachedWay],
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

  useEffect(() => {
    if (params.relation) {
      const fetchWays = async (relationId: string) => {
        // Only fetch if wayIds is empty
        if (relationId && wayIds.length === 0) {
          setIsRelationLoading(true);
          setShowRelationHeading(true);
          try {
            const ids = await overpassService.fetchWayIdsInRelation(relationId);
            if (ids.length === 0) {
              setShowAreaCompletedModal(true);
            } else {
              setCurrentWay(0);
              deduplicateNewWays(ids);
            }
          } catch (error) {
            setError(
              "Error fetching OSM data! This usually means the Overpass server has rejected the request. Try again on smaller area. Details: " +
                error,
            );
          } finally {
            setIsRelationLoading(false);
          }
        }
      };

      setRelation({ id: params.relation });
      fetchWays(relation.id);
    } else if (params.way) {
      const fetchWay = async (wayId: string) => {
        setIsRelationLoading(true);
        setShowRelationHeading(false);
        const wayIdStrings = wayId.split(",");
        try {
          const ways = await overpassService.fetchWays(wayIdStrings);
          setCurrentWay(0);
          // Convert OsmWay objects to just IDs for lazy loading
          const ids = ways.map((way) => way.id);
          deduplicateNewWays(ids, false);
        } catch (error) {
          setError(
            "Error fetching OSM data! This usually means the Overpass server has rejected the request. Try again on smaller area. Details: " +
              error,
          );
        } finally {
          setIsRelationLoading(false);
        }
      };
      fetchWay(params.way);
    } else if (isBoundingBox && wayIds.length === 0) {
      // Only fetch bounding box ways if wayIds is empty
      const fetchWaysInBoundingBox = async () => {
        if (bboxState.north) {
          setIsRelationLoading(true);
          try {
            const ids = await overpassService.fetchWayIdsInBbox([
              bboxState.south,
              bboxState.west,
              bboxState.north,
              bboxState.east,
            ]);

            if (ids.length === 0) {
              setShowAreaCompletedModal(true);
            } else {
              deduplicateNewWays(ids);
            }
          } catch (error) {
            setError(
              "Error fetching OSM data! This usually means the Overpass server has rejected the request. Try again on smaller area. Details: " +
                error,
            );
          } finally {
            setIsRelationLoading(false);
          }
        }
      };
      fetchWaysInBoundingBox();
    } else if (isCenterPoint && wayIds.length === 0) {
      if (!bboxState.north) {
        updateFromZXY({
          zoom: 15,
          x: Number(params.x) || 0,
          y: Number(params.y) || 0,
        });
      }
      const fetchWaysAroundCenterPoint = async () => {
        if (bboxState.north) {
          setIsRelationLoading(true);
          try {
            const ids = await overpassService.fetchWayIdsInBbox([
              bboxState.south,
              bboxState.west,
              bboxState.north,
              bboxState.east,
            ]);

            if (ids.length === 0) {
              setShowAreaCompletedModal(true);
            } else {
              deduplicateNewWays(ids);
            }
          } catch (error) {
            setError(
              "Error fetching OSM data! This usually means the Overpass server has rejected the request. Try again on smaller area. Details: " +
                error,
            );
          } finally {
            setIsRelationLoading(false);
          }
        }
      };
      fetchWaysAroundCenterPoint();
    }
  }, [
    params,
    bboxState,
    wayIds.length,
    deduplicateNewWays,
    relation.id,
    setCurrentWay,
    setRelation,
    isBoundingBox,
    isCenterPoint,
    updateFromZXY,
  ]);

  // Helper function to get current way details
  const getCurrentWayDetails = useCallback(async (): Promise<OsmWay | null> => {
    if (!lazyFetcher || currentWay < 0 || currentWay >= wayIds.length) {
      return null;
    }

    const wayId = wayIds[currentWay];

    // Try to get from cache first
    const cached = getCachedWay(wayId);
    if (cached) {
      return cached;
    }

    // Fetch from lazy fetcher
    if (lazyFetcher) {
      return await lazyFetcher.getWayAtIndex(currentWay);
    }

    return null;
  }, [lazyFetcher, currentWay, wayIds, getCachedWay]);

  const { currentWayCoordinates } = useWayManagement({
    getCurrentWayDetails,
  });

  // Handle current way and tags
  useEffect(() => {
    const updateWayTags = async () => {
      const currentWayDetails = await getCurrentWayDetails();

      if (currentWayDetails) {
        setNameFixAction("check");
        const currentWayTags = currentWayDetails.tags;

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
    };

    updateWayTags();
  }, [
    currentWay,
    wayIds,
    getCurrentWayDetails,
    setLanes,
    setSurface,
    setLanesBackward,
    setLanesForward,
    setLaneMarkings,
  ]);

  // Prefetch the next way when current way changes
  useEffect(() => {
    if (lazyFetcher) {
      setIsFetchingNext(true);
      lazyFetcher.prefetchNext(currentWay);
      setIsFetchingNext(false);
    }
  }, [currentWay, lazyFetcher, setIsFetchingNext]);

  // Cleanup lazy fetcher on unmount
  useEffect(() => {
    return () => {
      if (lazyFetcher) {
        lazyFetcher.destroy();
      }
    };
  }, [lazyFetcher]);

  const handleEnd = useCallback(() => {
    if (currentWay < wayIds.length - 1) {
      resetTags();
      setCurrentWay(currentWay + 1);
    } else {
      setShowFinishedModal(true);
    }
  }, [
    currentWay,
    wayIds.length,
    setCurrentWay,
    setShowFinishedModal,
    resetTags,
  ]);

  const handleActions = useMemo(
    () => ({
      skip: () => {
        const wayId = wayIds[currentWay];
        console.log("Skipped way", wayId);
        setLanes("");
        setSurface("");
        handleEnd();
      },
      fix: (message: string) => {
        const handleFix = async () => {
          const currentWayDetails = await getCurrentWayDetails();
          if (currentWayDetails) {
            const updatedWay = {
              ...currentWayDetails,
              tags: processWayTags(currentWayDetails.tags, {
                keepTigerReviewed: true,
                includeDetailTags: true,
                includeFixmeMessage: message,
              }),
            };
            console.info("Fixed way:", updatedWay);
            addToUpload(updatedWay);
            handleEnd();
          }
        };
        handleFix().catch((error) => console.error("Error fixing way:", error));
      },
      clearTiger: () => {
        const handleClearTiger = async () => {
          const currentWayDetails = await getCurrentWayDetails();
          if (currentWayDetails) {
            const updatedWay = {
              ...currentWayDetails,
              tags: processWayTags(currentWayDetails.tags, {
                keepTigerReviewed: false,
                includeDetailTags: false,
              }),
            };
            console.info("Updated way:", updatedWay);
            addToUpload(updatedWay);
            handleEnd();
          }
        };
        handleClearTiger().catch((error) =>
          console.error("Error clearing tiger:", error),
        );
      },
      submit: () => {
        const handleSubmit = async () => {
          const currentWayDetails = await getCurrentWayDetails();
          if (currentWayDetails) {
            const updatedWay: OsmWay = {
              ...currentWayDetails,
              tags: processWayTags(currentWayDetails.tags, {
                keepTigerReviewed: false,
                includeDetailTags: true,
              }),
            };
            console.info("Submitted way:", updatedWay);
            addToUpload(updatedWay);
            handleEnd();
          }
        };
        handleSubmit().catch((error) =>
          console.error("Error submitting way:", error),
        );
      },
    }),
    [
      setLanes,
      setSurface,
      handleEnd,
      wayIds,
      currentWay,
      processWayTags,
      addToUpload,
      getCurrentWayDetails,
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

      // Only handle keypress if logged in
      if (!loggedIn) return;

      switch (event.key) {
        case "u":
          setShowFinishedModal(true);
          break;
        case "f":
          handleActions.clearTiger();
          break;
        case "Enter":
          if (surface && (lanes || laneMarkings == false)) {
            handleActions.submit();
          }
          break;
        case "b":
          handleActions.fix("bad geometry");
          break;
        case "s":
          handleActions.fix("needs splitting");
          break;
        case "d":
          handleActions.fix("doesn't exist");
          break;
        case "n":
          handleActions.fix("check name value");
          break;
        case "c":
          handleActions.fix("check highway value");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    handleActions,
    lanes,
    laneMarkings,
    surface,
    setShowFinishedModal,
    loggedIn,
  ]);

  return (
    <div className="flex flex-col md:h-screen">
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
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
      <UploadModal
        show={showFinishedModal && !latestChangeset}
        ways={currentWay}
        onClose={() => setShowFinishedModal(false)}
        uploads={uploadWays}
        setUploadWays={setUploadWays}
        setChangeset={setLatestChangeset}
        setError={setError}
      />
      <AreaCompletedModal
        isOpen={showAreaCompletedModal}
        onClose={() => setShowAreaCompletedModal(false)}
        areaName={relation.name || ""}
      />
      <Navbar
        uploads={uploadWays}
        setShowFinishedModal={setShowFinishedModal}
        setShowHelpModal={setShowHelpModal}
        setShowSettingsModal={setShowSettingsModal}
      />
      <div className="flex flex-col md:flex-row flex-1 bg-background overflow-auto">
        <LeftPane
          showRelationHeading={showRelationHeading}
          bbox={bboxState}
          currentWay={currentWay}
          wayIds={wayIds}
          getCurrentWayDetails={getCurrentWayDetails}
          isLoading={isRelationLoading}
          showLaneDirection={showLaneDirection}
          setShowLaneDirection={setShowLaneDirection}
          convertDriveway={convertDriveway}
          setConvertDriveway={setConvertDriveway}
          nameFixAction={nameFixAction}
          setNameFixAction={setNameFixAction}
          streetAbbreviationAction={streetAbbreviationAction}
          setStreetAbbreviationAction={setStreetAbbreviationAction}
          laneTagFixAction={laneTagFixAction}
          setLaneTagFixAction={setLaneTagFixAction}
          onSkip={handleActions.skip}
          onFix={handleActions.fix}
          onClearTiger={handleActions.clearTiger}
          onSubmit={handleActions.submit}
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
