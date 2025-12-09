import React, { useMemo } from "react";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { filterImageryLayersAtLocation } from "../services/imagery";
import { Coordinate } from "../objects";
import { TileSources } from "../services/imagery";
import imagery_json from "../assets/filtered.json";
import { FeatureCollection, Polygon } from "geojson";

const typedImageryJson = imagery_json as FeatureCollection<Polygon>;

interface ImagerySelectProps {
  selectedSourceId: string;
  onSourceChange: (sourceId: string) => void;
  center: Coordinate;
  zoom?: number;
  tileSources: TileSources;
}

const ImagerySelect: React.FC<ImagerySelectProps> = ({
  selectedSourceId,
  onSourceChange,
  center,
  zoom = 5,
  tileSources,
}) => {
  const visibleFeatures = useMemo(() => {
    return filterImageryLayersAtLocation(
      typedImageryJson,
      center.lon,
      center.lat,
    );
  }, [center]);

  // Separate sources into two groups
  const { standardSources, baseSources } = useMemo(() => {
    const available = visibleFeatures.reduce((acc: TileSources, feature) => {
      const id = feature.properties?.id;
      if (id && tileSources[id]) {
        acc[id] = tileSources[id];
      }
      return acc;
    }, {});

    return Object.entries(available).reduce(
      (
        acc: { standardSources: TileSources; baseSources: TileSources },
        [id, source],
      ) => {
        // Check if the source is national
        const baseSources = ["Esri", "USGS", "OpenAerialMap", "NAIP"];
        if (baseSources.some((source) => id.includes(source))) {
          acc.baseSources[id] = source;
        } else {
          acc.standardSources[id] = source;
        }
        return acc;
      },
      { standardSources: {}, baseSources: {} },
    );
  }, [visibleFeatures, tileSources]);

  return (
    <Select
      size="sm"
      label="Imagery"
      selectedKeys={[selectedSourceId]}
      scrollShadowProps={{
        isEnabled: false,
      }}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0];
        if (selectedKey) {
          onSourceChange(selectedKey.toString());
        }
      }}
      className="max-w-xs"
    >
      <>
        {/* Standard sources */}
        {zoom > 8 && Object.keys(standardSources).length > 0 ? (
          <SelectSection title={"Regional"}>
            {Object.entries(standardSources).map(([id, source]) => (
              <SelectItem key={id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectSection>
        ) : null}

        {/* Base sources (Esri and USGS) */}
        <SelectSection title={"National"}>
          {Object.entries(baseSources).map(([id, source]) => (
            <SelectItem key={id}>
              {source.name}
            </SelectItem>
          ))}
        </SelectSection>
      </>
    </Select>
  );
};

export default ImagerySelect;
