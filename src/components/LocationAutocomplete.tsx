import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";

interface LocationFeature {
  properties: {
    name: string;
    osm_type: string;
    osm_id: string;
    osm_key: string;
    osm_value: string;
    country: string;
    countrycode?: string;
    state?: string;
    county?: string;
    type?: string;
  };
}

export const LocationAutocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);

  // Use useEffect instead of useMemo for side effects like API calls
  useEffect(() => {
    // Only fetch if input is long enough
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    // Create a function to fetch suggestions
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(inputValue)}`,
        );
        const data = await response.json();

        const filteredSuggestions = data.features.filter(
          (feature: LocationFeature) =>
            feature.properties.osm_type === "R" &&
            feature.properties.countrycode === "US",
        );

        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    // Add debounce
    const timeoutId = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]); // Dependency array ensures this runs when inputValue changes

  const generateLocationDescription = (feature: LocationFeature): string => {
    const { state, county, type, osm_value } = feature.properties;
    if (type !== "other" && state && county) {
      return `${type} in ${county}, ${state}`;
    } else if (type !== "other" && state) {
      return `${type} in ${state}`;
    } else if (state) {
      return `${osm_value.replaceAll("_", " ")} in ${state}`;
    } else {
      return `${osm_value.replaceAll("_", " ")}`;
    }
  };

  const handleSubmit = () => {
    if (selectedLocation) {
      // Navigate to the location page with the osm_id
      window.location.href = `/tigerking/?relation=${selectedLocation.properties.osm_id}`;
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete
        label="Location"
        placeholder="Enter a location"
        listboxProps={{
          emptyContent: "No OSM relations found.",
        }}
        value={inputValue}
        onInputChange={handleInputChange}
        onSelectionChange={(key) => {
          // Convert key to number if it's a string
          const index = Number(key);

          // Use the index to select the location
          if (!isNaN(index) && index >= 0 && index < suggestions.length) {
            setSelectedLocation(suggestions[index]);
          } else {
            setSelectedLocation(null);
          }
        }}
      >
        {suggestions.map((feature, index) => (
          <AutocompleteItem
            key={index}
            title={feature.properties.name}
            description={generateLocationDescription(feature)}
            value={feature.properties.name}
          >
            {feature.properties.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      <Button
        color="primary"
        onPress={handleSubmit}
        isDisabled={!selectedLocation}
        className="w-full"
      >
        Load
      </Button>
    </div>
  );
};

export default LocationAutocomplete;
