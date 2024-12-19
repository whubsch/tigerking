import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Form,
  Input,
} from "@nextui-org/react";
// import Location from "./components/Location";
import WayHeading from "./components/WayHeading";
import WayMap from "./components/WayMap";
import { OsmWay } from "./objects";

import "maplibre-gl/dist/maplibre-gl.css"; // MapLibre CSS for styling

const App: React.FC = () => {
  const [surfaceKeys, setSurfaceKeys] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [relationId, setRelationId] = useState<string>("");
  const [overpassWays, setOverpassWays] = useState<OsmWay[]>([]);

  const handleRelationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the wikidataId value here
    // Overpass API query to get relation and its ways
    const query = `
      [out:json];

      rel(${relationId});
      map_to_area->.hood;

      (way(area.hood)[highway][name]["tiger:reviewed"=no][!surface];);

      out body geom;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("OSM Data:", data);

      // Process the response data
      // The response will include the relation, its member ways, and all nodes
      const ways = data.elements.filter(
        (element: OsmWay) => element.type === "way",
      );
      setOverpassWays(ways);
      console.log("Ways:", ways);

      // You can now use this data to draw the relation on your map
      // or extract other information you need
    } catch (error) {
      console.error("Error fetching OSM data:", error);
      // Handle the error appropriately
    }
  };

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
          {overpassWays && overpassWays.length > 0 ? (
            <WayHeading
              name={overpassWays[0].tags?.name ?? ""}
              type={overpassWays[0].tags?.highway ?? ""}
              wayId={overpassWays[0].id?.toString() ?? ""}
            />
          ) : null}
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
                    onSelectionChange={(keys) =>
                      setSurfaceKeys(Array.from(keys)[0] as string)
                    }
                  >
                    <DropdownSection showDivider title="generic">
                      <DropdownItem key="paved">paved</DropdownItem>
                      <DropdownItem key="unpaved">unpaved</DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="uncommon">
                      <DropdownItem key="brick">brick</DropdownItem>
                      <DropdownItem key="gravel">gravel</DropdownItem>
                      <DropdownItem key="ground">ground</DropdownItem>
                    </DropdownSection>
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
        <WayMap longitude={-73.985428} latitude={40.748817} zoom={16} />
      </div>
    </div>
  );
};

export default App;
