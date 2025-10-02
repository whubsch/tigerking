import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import ConfirmationModal from "./modals/ConfirmationModal";
import search from "../assets/search.svg";
import Icon from "./Icon";

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

interface LocationAutocompleteProps {
  compact?: boolean;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  compact = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only fetch if input is long enough
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    // Create a function to fetch suggestions
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsLoading(false);
      }
    };

    // Add debounce
    const timeoutId = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

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
    <div
      className={`
        flex
        ${compact ? "flex-row items-center gap-2" : "flex-col gap-2"}
        ${className}
      `}
    >
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        confirmText="Change"
      >
        <p>
          This will reset your progress, although your edits will remain
          available. Are you sure you want to change the area?
        </p>
      </ConfirmationModal>
      <Autocomplete
        label={!compact ? "Location" : undefined}
        aria-label={compact ? "Location Search" : undefined}
        className={compact ? "flex-grow" : ""}
        placeholder="Enter a location"
        listboxProps={{
          emptyContent: "No OSM relations found.",
        }}
        isLoading={isLoading}
        value={inputValue}
        onInputChange={handleInputChange}
        onSelectionChange={(key) => {
          const index = Number(key);
          if (!isNaN(index) && index >= 0 && index < suggestions.length) {
            setSelectedLocation(suggestions[index]);
          } else {
            setSelectedLocation(null);
          }
        }}
        endContent={
          compact ? (
            <Button
              size="sm"
              isIconOnly
              color="primary"
              onPress={() => setIsConfirmModalOpen(true)}
              isDisabled={!selectedLocation}
              className="rounded-full m-1"
              aria-label="Load"
            >
              <Icon
                src={search}
                alt="search"
                size="w-4 h-4"
                invert={false}
                className="stroke-white"
              />
            </Button>
          ) : null
        }
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
        className={`${compact ? "hidden" : "w-full"}`}
        aria-label="Load"
      >
        <Icon
          src={search}
          alt="search"
          size="w-4 h-4"
          invert={false}
          className="stroke-white"
        />
        Load
      </Button>
    </div>
  );
};

export default LocationAutocomplete;
