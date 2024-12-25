import React, { useState, useMemo } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
// import Location from "./components/Location";
import WayHeading from "./components/WayHeading";
import WayMap from "./components/WayMap";
import { OsmWay } from "./objects";
import { overpassService } from "./services/overpass";
import SurfaceButtons from "./components/SurfaceButtons";
import LanesButtons from "./components/LanesButtons";
import RelationForm from "./components/RelationForm";
import MainNavbar from "./components/Navbar";
import RelationTags from "./components/RelationHeading";
import QuickTags from "./components/QuickTags";

import "maplibre-gl/dist/maplibre-gl.css"; // MapLibre CSS for styling
import { useOsmAuthContext } from "./contexts/useOsmAuth";

const App: React.FC = () => {
  const [surfaceKeys, setSurfaceKeys] = useState<string>("");
  const [lanesKeys, setLanesKeys] = useState<string>(""); // Add this line
  const [relationId, setRelationId] = useState<string>("");
  const [overpassWays, setOverpassWays] = useState<OsmWay[]>([]);
  const [currentWay, setCurrentWay] = useState<number>(0);
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [uploadWays, setUploadWays] = useState<OsmWay[]>([]);
  const [location, setLocation] = useState<string>("");
  const [latestChangeset, setLatestChangeset] = useState<number>(0);
  const { loggedIn, loading } = useOsmAuthContext();

  const handleSkip = () => {
    setLanesKeys("");
    setSurfaceKeys("");
    setCurrentWay(currentWay + 1);

    console.log("Skip clicked");
  };

  const handleFix = (message: string) => {
    overpassWays[currentWay].tags = {
      ...overpassWays[currentWay].tags, // Keep existing tags
      "fixme:tigerking": message,
    };
    setUploadWays((prevWays) => [...prevWays, overpassWays[currentWay]]);

    setLanesKeys("");
    setSurfaceKeys("");
    setCurrentWay(currentWay + 1);
  };

  const handleSubmit = () => {
    overpassWays[currentWay].tags = {
      ...overpassWays[currentWay].tags, // Keep existing tags
      surface: surfaceKeys,
      ...(lanesKeys === "none"
        ? { lane_markings: "no" }
        : { lanes: lanesKeys }),
    };
    setUploadWays((prevWays) => [...prevWays, overpassWays[currentWay]]);

    setLanesKeys("");
    setSurfaceKeys("");
    setCurrentWay(currentWay + 1);
  };

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRelationHeading(true);

    try {
      const ways = await overpassService.fetchWaysInRelation(relationId);
      setOverpassWays(ways);
      console.log("Ways:", ways);
    } catch (error) {
      console.error("Error fetching OSM data:", error);
      // Handle error in UI (maybe set an error state)
    }
  };

  const wayCoordinates = useMemo(
    () =>
      overpassWays[currentWay]?.geometry.map(
        (coord) => [coord.lon, coord.lat] as [number, number],
      ) || [],
    [overpassWays, currentWay], // Only recalculate when these dependencies change
  );

  const memoizedMap = useMemo(
    () => <WayMap coordinates={wayCoordinates} zoom={16} />,
    [wayCoordinates],
  );

  const fixOptions = [
    { key: "bad-geometry", label: "Bad geometry" },
    { key: "needs-splitting", label: "Needs splitting" },
    { key: "doesnt-exist", label: "Doesn't exist" },
  ];

  return (
    <div className="flex flex-col md:h-screen">
      <Modal isOpen={latestChangeset !== 0}>
        <ModalContent>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <p>Changeset ID: {latestChangeset}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
      <MainNavbar
        uploads={uploadWays}
        setUploadWays={setUploadWays}
        location={location}
        setChangeset={setLatestChangeset}
      />
      <div className="flex flex-col md:flex-row flex-1 bg-background overflow-auto">
        {/* Left Pane */}
        <div className="w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4">
          {loading ? (
            <div>Loading authentication state...</div>
          ) : (
            <div className="p-4">
              {relationId && showRelationHeading ? (
                <RelationTags
                  relationId={relationId}
                  setRelationName={setLocation}
                />
              ) : (
                <RelationForm
                  relationId={relationId}
                  setRelationId={setRelationId}
                  onSubmit={handleRelationSubmit}
                />
              )}
            </div>
          )}
          <Card className="rounded-lg shadow p-4 gap-2 flex flex-col md:grow">
            {overpassWays && overpassWays.length > 0 ? (
              <div>
                <div>
                  <WayHeading
                    tags={overpassWays[currentWay].tags}
                    wayId={overpassWays[currentWay].id?.toString() ?? ""}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="py-2 flex flex-col gap-4">
                      <SurfaceButtons
                        surfaceKeys={surfaceKeys}
                        setSurfaceKeys={setSurfaceKeys}
                      />
                      <LanesButtons
                        lanesKeys={lanesKeys}
                        setLanesKeys={setLanesKeys}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {loading ? (
                    <div>Loading...</div>
                  ) : loggedIn ? (
                    <>
                      <QuickTags
                        surfaceKeys={surfaceKeys}
                        lanesKeys={lanesKeys}
                        onSurfaceChange={setSurfaceKeys}
                        onLanesChange={setLanesKeys}
                      />
                      <div className="flex gap-2 w-full mt-4">
                        <Button
                          color="default"
                          size="md"
                          className="flex-1"
                          onPress={handleSkip}
                        >
                          Skip
                        </Button>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              color="default"
                              size="md"
                              className="flex-1"
                            >
                              Fix
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Fix options"
                            onAction={(key) => handleFix(key as string)}
                          >
                            {fixOptions.map((option) => (
                              <DropdownItem key={option.key}>
                                {option.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                        <Button
                          color="primary"
                          size="md"
                          className="flex-1"
                          onPress={handleSubmit}
                          isDisabled={!surfaceKeys || !lanesKeys}
                        >
                          Submit
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p>Please log in to submit changes.</p>
                  )}
                </div>
              </div>
            ) : (
              <p>Enter a relation ID to get started.</p>
            )}
          </Card>
        </div>
        {/* Right Pane */}
        <div className="w-full flex md:flex-1 h-[600px] md:h-auto p-4">
          {memoizedMap}
        </div>
      </div>
    </div>
  );
};

export default App;
