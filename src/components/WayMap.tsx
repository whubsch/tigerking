import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface WayMapProps {
  coordinates: [number, number][];
  zoom?: number;
}

const WayMap: React.FC<WayMapProps> = ({ coordinates, zoom = 15 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

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
            // tiles: ,
            tiles:
              window.location.hostname !== "localhost"
                ? [
                    "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                  ]
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
            4, // Width 2 at zoom level 12 or less
            15,
            6, // Width 4 at zoom level 15
            17,
            8, // Width 8 at zoom level 18
            22,
            14, // Width 12 at zoom level 22
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

    // line.current = new maplibregl.GeoJSONSource();
    // map.current.addLayer({
    //   id: "line_example",
    //   type: "line",
    //   source: {
    //     type: "geojson",
    //     data: {
    //       type: "Feature",
    //       properties: {},
    //       geometry: {
    //         type: "LineString",
    //         coordinates: [
    //           [longitude, latitude],
    //           // Add more coordinate pairs to create a line
    //           [longitude + 0.01, latitude + 0.01], // Example second point
    //         ],
    //       },
    //     },
    //   },
    //   paint: { "line-color": "#198EC8" },
    // });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [coordinates, zoom]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
  );
};

export default WayMap;
