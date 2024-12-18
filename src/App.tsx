import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Form,
  Input,
} from "@nextui-org/react";
// import Location from "./components/Location";

import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"; // MapLibre CSS for styling

const App: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null); // Ref for map container
  const [surfaceKeys, setSurfaceKeys] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [relationId, setRelationId] = useState<string>("");

  const handleRelationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the wikidataId value here
    console.log("Submitted:", relationId);
  };

  useEffect(() => {
    // Initialize the MapLibre map
    if (mapContainer.current) {
      const map = new Map({
        container: mapContainer.current, // Map container reference
        style: "https://demotiles.maplibre.org/style.json", // MapLibre demo tiles
        center: [0, 0], // Default center [longitude, latitude]
        zoom: 2, // Default zoom level
      });

      return () => map.remove(); // Cleanup map on unmount
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Pane */}
      <div className="w-full md:w-1/3 bg-gray-100 p-4 border-b md:border-r border-gray-200">
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <Form onSubmit={handleRelationSubmit}>
            <Input
              isRequired
              errorMessage="Please enter a valid OSM relation ID"
              label="OSM Relation ID"
              labelPlacement="outside"
              name="relation"
              placeholder="12345"
              type="number"
              value={relationId}
              onChange={(e) => setRelationId(e.target.value)}
            />
            <Button type="submit" variant="bordered">
              Submit
            </Button>
          </Form>
          <h1 className="text-xl font-bold mb-4">Tags</h1>
          <h3 className="text-normal text-blue-500">Way 12345</h3>
          <div className="flex flex-col gap-2">
            <div>
              <h2 className="text-lg">Surface</h2>
              <ButtonGroup variant="bordered">
                <Button>asphalt</Button>
                <Button>compacted</Button>
                <Button>concrete</Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">
                      {surfaceKeys ? surfaceKeys : "Other"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Single selection example"
                    selectedKeys={surfaceKeys}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSurfaceKeys}
                  >
                    <DropdownItem key="paved">paved</DropdownItem>
                    <DropdownItem key="unpaved">unpaved</DropdownItem>
                    <DropdownItem key="brick">brick</DropdownItem>
                    <DropdownItem key="gravel">gravel</DropdownItem>
                    <DropdownItem key="ground">ground</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </div>
            <div>
              <h2 className="text-lg">Lanes</h2>
              <ButtonGroup variant="bordered">
                <Button>None</Button>
                <Button>2</Button>
                <Button>4</Button>
                <Button>Other</Button>
              </ButtonGroup>
            </div>
          </div>
          <div>
            <Button
              color="default"
              size="md"
              className="h-10 md:h-14 w-full md:w-auto "
            >
              Skip
            </Button>
            <Button
              color="primary"
              size="md"
              className="h-10 md:h-14 w-full md:w-auto "
            >
              Submit
            </Button>
          </div>
          <div>
            {loggedInUser ? <Button>Logout</Button> : <Button>Login</Button>}
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex-1 p-4 bg-white">
        {/* <h2 className="text-xl font-bold mb-4">Right Pane</h2> */}
        <div ref={mapContainer} />
      </div>

      {/* Right Pane - 2/3 of the screen */}
      {/* <div className="basis-2/3">
        <div
          ref={mapContainer}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </div> */}
    </div>
  );
};

export default App;
