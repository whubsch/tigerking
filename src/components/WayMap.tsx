import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ImagerySelect from "./ImagerySelect";
import {
  processImagerySources,
  getDefaultImagerySourceId,
  filterImageryLayersAtLocation,
} from "../services/imagery";
import imageryJson from "../assets/filtered.json";
import arrowIcon from "../assets/arrow.svg";
import { FeatureCollection, Polygon } from "geojson";

const { TILE_SOURCES } = processImagerySources(imageryJson);
const typedImageryJson = imageryJson as FeatureCollection<Polygon>;

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Calculate center point from coordinates
    const bounds = coordinates.length
      ? coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
        )
      : new maplibregl.LngLatBounds(
          [-124.848974, 24.396308],
          [-66.885444, 49.384358],
        );

    // Check if current imagery covers the new location and switch if needed
    if (coordinates.length > 0) {
      const center = bounds.getCenter();
      const visibleFeatures = filterImageryLayersAtLocation(
        typedImageryJson,
        center.lng,
        center.lat,
      );

      const currentSourceAvailable = visibleFeatures.some(
        (feature) => feature.properties?.id === selectedSourceId,
      );

      if (!currentSourceAvailable) {
        const defaultSourceId = getDefaultImagerySourceId(TILE_SOURCES);
        setSelectedSourceId(defaultSourceId);
      }
    }

    setImagery(TILE_SOURCES[selectedSourceId].name);

    const currentTileSource = TILE_SOURCES[selectedSourceId]?.url || "";
    const sourceMaxZoom = TILE_SOURCES[selectedSourceId]?.maxZoom || 22;

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [currentTileSource],
            tileSize: 256,
            attribution: (() => {
              const attr = TILE_SOURCES[selectedSourceId]?.attribution;
              if (attr?.url && attr?.text) {
                return `<a href="${attr.url}" target="_blank" rel="noopener noreferrer">${attr.text}</a>`;
              }
              return attr?.text || "OpenStreetMap contributors";
            })(),
            maxzoom: sourceMaxZoom,
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 24,
          },
        ],
      },
      bounds: bounds,
      fitBoundsOptions: {
        padding: 50,
        maxZoom: Math.min(sourceMaxZoom, 19),
      },
    });

    map.current.on("style.load", () => {
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
          "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.9, // At zoom level 10, opacity is 0.8
            15,
            0.5,
            20,
            0.35,
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
              0.1, // At zoom level 10, icon is 0.1 times original size
              13,
              0.2,
              15,
              0.5,
              19,
              0.7,
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
              0.2,
              17,
              0.5,
              19,
              0.7,
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
  }, [coordinates, zoom, selectedSourceId, setImagery]);

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
