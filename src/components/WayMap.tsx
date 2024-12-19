import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface WayMapProps {
  longitude: number;
  latitude: number;
  zoom?: number;
}

const WayMap: React.FC<WayMapProps> = ({ longitude, latitude, zoom = 15 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
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
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add a marker
    marker.current = new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

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
      marker.current?.remove();
      map.current?.remove();
    };
  }, [longitude, latitude, zoom]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
  );
};

export default WayMap;
