import React, { useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { TileSources } from "../services/imagery";

interface ImagerySelectProps {
  selectedSourceId: string;
  countrywideSourcesMap: TileSources;
  otherSourcesMap: TileSources;
  onSourceChange: (sourceId: string) => void;
}

const ImagerySelect: React.FC<ImagerySelectProps> = ({
  selectedSourceId,
  countrywideSourcesMap,
  otherSourcesMap,
  onSourceChange,
}) => {
  const combinedSources = useMemo(() => {
    return {
      ...countrywideSourcesMap,
      ...otherSourcesMap,
    };
  }, [countrywideSourcesMap, otherSourcesMap]);

  return (
    <Autocomplete
      size="sm"
      label="Imagery"
      defaultSelectedKey={selectedSourceId}
      onSelectionChange={(key) => {
        if (key) {
          onSourceChange(key.toString());
        }
      }}
      className="max-w-xs"
    >
      {Object.entries(combinedSources).map(([id, source]) => (
        <AutocompleteItem key={id} value={id}>
          {source.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default ImagerySelect;
