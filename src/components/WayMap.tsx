import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ImagerySelect from "./ImagerySelect";
import {
  processImagerySources,
  getDefaultImagerySourceId,
} from "../services/imagery";
import imageryJson from "../assets/filtered.json";
import arrowIcon from "../assets/arrow.svg";

const { TILE_SOURCES } = processImagerySources(imageryJson);

interface WayMapProps {
  coordinates: [number, number][];
  setImagery: (value: string) => void;
  zoom?: number;
}

const WayMap: React.FC<WayMapProps> = ({
  coordinates,
  setImagery,
  zoom = 15,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState(() =>
    getDefaultImagerySourceId(TILE_SOURCES),
  );
  const tileSource = TILE_SOURCES[selectedSourceId]?.url || "";

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

    setImagery(TILE_SOURCES[selectedSourceId].name);

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [tileSource],
            tileSize: 256,
            attribution:
              Object.values(TILE_SOURCES).find(
                (source) => source.url === tileSource,
              )?.attribution?.text || "OpenStreetMap contributors",
            maxzoom:
              Object.values(TILE_SOURCES).find(
                (source) => source.url === tileSource,
              )?.maxZoom || 22,
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

      // Load the arrow image
      const arrow = new Image(60, 60);
      arrow.onload = () => {
        // Ensure the image is added before creating the symbol layer
        map.current?.addImage("arrow", arrow, {});

        // Only add the arrow layer if showLaneDirection is true
        map.current?.addLayer({
          id: "way-line-arrows",
          type: "symbol",
          source: "way-line",
          layout: {
            "symbol-placement": "line",
            "symbol-spacing": 150,
            "icon-image": "arrow",
            "icon-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              0.1, // At zoom level 10, icon is 0.3 times original size
              13,
              0.2, // At zoom level 13, icon is 0.4 times original size
              15,
              0.5, // At zoom level 15, icon is 0.5 times original size
              19,
              1, // At zoom level 17, icon is 0.7 times original size
            ],
            "icon-rotate": -90,
          },
          paint: {
            "icon-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              12,
              0, // At zoom level 12, still completely transparent
              15,
              0.2, // At zoom level 13, start becoming slightly visible
              17,
              0.5, // At zoom level 15, more opaque
              19,
              0.7, // At zoom level 17, very visible
            ],
          },
        });
      };

      // Set the src after setting up onload
      arrow.src = decodeURIComponent(arrowIcon);
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [coordinates, zoom, tileSource, selectedSourceId, setImagery]);

  const handleTileSourceChange = (sourceId: string) => {
    if (map.current && TILE_SOURCES[sourceId]) {
      const mapSource = map.current.getSource(
        "raster-tiles",
      ) as maplibregl.RasterTileSource;
      mapSource.setTiles([TILE_SOURCES[sourceId].url]);
      setSelectedSourceId(sourceId);
      setImagery(TILE_SOURCES[sourceId].name);
    }
  };

  const [mapCenter, setMapCenter] = useState<{
    lng: number;
    lat: number;
    zoom: number;
  }>({
    lng: -98.66,
    lat: 40.5,
    zoom: zoom,
  });

  useEffect(() => {
    if (map.current) {
      // Set initial center when map is first created
      const initialCenter = map.current.getCenter();
      const initialZoom = map.current.getZoom();
      setMapCenter({
        lng: initialCenter.lng,
        lat: initialCenter.lat,
        zoom: initialZoom,
      });

      // Add event listener for subsequent moves
      map.current.on("moveend", () => {
        const center = map.current?.getCenter();
        const currentZoom = map.current?.getZoom();
        if (center) {
          setMapCenter({
            lng: center.lng,
            lat: center.lat,
            zoom: currentZoom || 5,
          });
        }
      });
    }
  }, [coordinates]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-2 md:bottom-auto md:top-2 left-2 z-10 w-40 md:w-72">
        <ImagerySelect
          selectedSourceId={selectedSourceId}
          onSourceChange={handleTileSourceChange}
          center={{
            lat: mapCenter.lat,
            lon: mapCenter.lng,
          }}
          zoom={mapCenter.zoom}
          tileSources={TILE_SOURCES}
        />
      </div>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
};

export default WayMap;
