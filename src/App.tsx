import React, { useState, useMemo } from "react";
import { Button, Card } from "@nextui-org/react";
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

import "maplibre-gl/dist/maplibre-gl.css"; // MapLibre CSS for styling
import { OsmAuthProvider, useOsmAuthContext } from "./contexts/AuthContext";

const App: React.FC = () => {
  const [surfaceKeys, setSurfaceKeys] = useState<string>("");
  const [lanesKeys, setLanesKeys] = useState<string>(""); // Add this line
  const [relationId, setRelationId] = useState<string>("");
  const [overpassWays, setOverpassWays] = useState<OsmWay[]>([]);
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [currentWay, setCurrentWay] = useState<number>(0);
  const [showRelationHeading, setShowRelationHeading] = useState(false);
  const [uploadWays, setUploadWays] = useState<OsmWay[]>([]); // const { loggedIn } = useOsmAuthContext();
  const { loggedIn } = useOsmAuthContext();

  const handleSkip = () => {
    setLanesKeys("");
    setSurfaceKeys("");

    console.log("Skip clicked");
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
    console.log("Submit clicked", overpassWays[currentWay]);
    console.log("uploadWays:", uploadWays);
    // console.log(
    //   "XML changeset:",
    //   osmXmlBuilder.createChangeSet(uploadWays, -1),
    // );

    setCurrentWay(currentWay + 1);
    setUploadCount(uploadCount + 1);
    setLanesKeys("");
    setSurfaceKeys("");
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

  return (
    <OsmAuthProvider>
      <div className="flex flex-col h-screen">
        <MainNavbar uploadCount={uploadCount} />
        <div className="flex flex-1 bg-background">
          {/* Left Pane */}
          <div className="flex flex-col w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4">
            <div className="p-4">
              {relationId && showRelationHeading ? (
                <RelationTags relationId={relationId} />
              ) : (
                <RelationForm
                  relationId={relationId}
                  setRelationId={setRelationId}
                  onSubmit={handleRelationSubmit}
                />
              )}
            </div>
            <Card className="rounded-lg shadow p-4 gap-2">
              {overpassWays && overpassWays.length > 0 ? (
                <>
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
                    {loggedIn ? (
                      <div className="flex gap-2 w-full mt-4">
                        <Button
                          color="default"
                          size="md"
                          className="flex-1"
                          onPress={handleSkip}
                        >
                          Skip
                        </Button>
                        <Button color="default" size="md" className="flex-1">
                          Fix
                        </Button>
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
                    ) : (
                      <p>Please log in to submit changes.</p>
                    )}
                  </div>
                </>
              ) : (
                <p>Enter a relation ID to get started.</p>
              )}
            </Card>
          </div>

          {/* Right Pane */}
          <div className="flex-1 p-4">{memoizedMap}</div>
        </div>
      </div>
    </OsmAuthProvider>
  );
};

export default App;
