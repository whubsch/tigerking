import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Select, SelectItem } from "@nextui-org/react";

const TILE_SOURCES = {
  esri: {
    name: "ESRI Clarity",
    url: "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  street: {
    name: "USDA NAIP",
    url: "https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}",
  },
};

interface WayMapProps {
  coordinates: [number, number][];
  zoom?: number;
}

const WayMap: React.FC<WayMapProps> = ({ coordinates, zoom = 15 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [tileSource, setTileSource] = useState(TILE_SOURCES.street.url);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Calculate center point from coordinates
    const bounds = coordinates.length
      ? coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
        )
      : new maplibregl.LngLatBounds(
          [-124.848974, 24.396308], // Southwest coordinates [lng, lat]
          [-66.885444, 49.384358], // Northeast coordinates [lng, lat]
        );

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles:
              window.location.hostname !== "localhost" &&
              window.location.hostname !== "127.0.0.1"
                ? [tileSource]
                : ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '<a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      bounds: bounds,
      fitBoundsOptions: { padding: 50 },
    });

    // Add a marker
    map.current.on("load", () => {
      // Add the line source
      map.current?.addSource("way-line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      // Add the line layer
      map.current?.addLayer({
        id: "way-line-layer",
        type: "line",
        source: "way-line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff3100",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            4,
            15,
            6,
            17,
            8,
            22,
            14,
          ],
          "line-dasharray": [2, 2],
          "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.9, // At zoom level 10, opacity is 0.8
            15,
            0.5, // At zoom level 15, opacity is 0.5
            20,
            0.2, // At zoom level 20, opacity is 0.2
          ],
        },
      });
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [coordinates, zoom, tileSource]);

  const handleTileSourceChange = (sourceUrl: string) => {
    if (map.current) {
      const mapSource = map.current.getSource(
        "raster-tiles",
      ) as maplibregl.RasterTileSource;
      mapSource.setTiles([sourceUrl]);
      setTileSource(sourceUrl);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 w-40">
        <Select
          size="sm"
          label="Map Style"
          defaultSelectedKeys={[tileSource]}
          onChange={(e) => handleTileSourceChange(e.target.value)}
        >
          {Object.values(TILE_SOURCES).map((source) => (
            <SelectItem key={source.url} value={source.url}>
              {source.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default WayMap;
