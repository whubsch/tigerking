import React, { useState } from "react";
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

import "maplibre-gl/dist/maplibre-gl.css"; // MapLibre CSS for styling
import { OsmAuthProvider, useOsmAuthContext } from "./contexts/AuthContext";

const App: React.FC = () => {
  const [surfaceKeys, setSurfaceKeys] = useState<string>("");
  const [lanesKeys, setLanesKeys] = useState<string>(""); // Add this line
  // const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [relationId, setRelationId] = useState<string>("");
  const [overpassWays, setOverpassWays] = useState<OsmWay[]>([]);
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [currentWay, setCurrentWay] = useState<number>(0);
  const uploadWays: OsmWay[] = [];
  const { loggedIn } = useOsmAuthContext();

  const handleSkip = () => {
    setLanesKeys("");
    setSurfaceKeys("");

    console.log("Skip clicked");
  };

  const handleSubmit = () => {
    uploadWays.push(overpassWays[0]);
    setCurrentWay(currentWay + 1);
    setUploadCount(uploadCount + 1);
    setLanesKeys("");
    setSurfaceKeys("");

    console.log("Submit clicked");
  };

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ways = await overpassService.fetchWaysInRelation(relationId);
      setOverpassWays(ways);
      console.log("Ways:", ways);
    } catch (error) {
      console.error("Error fetching OSM data:", error);
      // Handle error in UI (maybe set an error state)
    }
  };

  return (
    <OsmAuthProvider>
      <div className="flex flex-col h-screen">
        <MainNavbar uploadCount={uploadCount} />
        <div className="flex flex-1 bg-background">
          {/* Left Pane */}
          <div className="flex flex-col w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4">
            <Card className="rounded-lg shadow p-4">
              <RelationForm
                relationId={relationId}
                setRelationId={setRelationId}
                onSubmit={handleRelationSubmit}
              />
            </Card>
            <Card className="rounded-lg shadow p-4 gap-2">
              {overpassWays && overpassWays.length > 0 ? (
                <>
                  <WayHeading
                    name={overpassWays[currentWay].tags?.name ?? ""}
                    type={overpassWays[currentWay].tags?.highway ?? ""}
                    wayId={overpassWays[currentWay].id?.toString() ?? ""}
                  />
                  <div className="flex flex-col gap-2">
                    <div>
                      <h2 className="text-lg">Tags</h2>
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
                        <Button
                          color="primary"
                          size="md"
                          className="flex-1"
                          onPress={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <p>Please login to submit changes.</p>
                    )}
                  </div>
                </>
              ) : (
                <p>Enter a relation ID to get started.</p>
              )}
            </Card>
          </div>

          {/* Right Pane */}
          <div className="flex-1 p-4">
            <WayMap longitude={-73.985428} latitude={40.748817} zoom={16} />
          </div>
        </div>
      </div>
    </OsmAuthProvider>
  );
};

export default App;
