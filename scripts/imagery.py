"""
A script to fetch, filter, and save GeoJSON data from OpenStreetMap editor layer index.
This module specifically filters imagery layers for US-based photo/satellite data.

The script can fetch GeoJSON from a URL, filter it based on specific criteria,
and save the filtered results to a file.
"""

import json
from typing import Any
import requests
import re


def fetch_geojson_from_url(url: str) -> dict[str, Any]:
    """
    Fetch GeoJSON data from a specified URL.

    Args:
        url: The URL to fetch the GeoJSON data from.

    Returns:
        dict containing the GeoJSON data.

    Raises:
        requests.exceptions.RequestException: If the HTTP request fails.
    """
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad status codes
    return response.json()


def filter_geojson(geojson_data: dict[str, Any]) -> dict[str, Any]:
    """
    Filter GeoJSON features based on specific criteria.

    Filters for features that are:
    - Located in the US (country_code = "US") or worldwide
    - Of type "tms" or "wms"
    - In the "photo" category

    Args:
        geojson_data: The input GeoJSON data as a dictionary.

    Returns:
        dict containing the filtered GeoJSON data.

    Raises:
        ValueError: If the input GeoJSON format is invalid.
    """
    # Verify it's a valid GeoJSON
    if not geojson_data or "type" not in geojson_data or "features" not in geojson_data:
        raise ValueError("Invalid GeoJSON format")

    # Filter features based on properties
    filtered_features = []
    for feature in geojson_data["features"]:
        if "properties" in feature:
            props = feature["properties"]
            if (
                props.get("country_code", "US") == "US"
                and props.get("type") in ["tms", "wms"]
                and props.get("category") == "photo"
                and "{apikey}" not in props.get("url").lower()
                and ("Coast" not in props.get("name") or "eox.at" in props.get("name"))
            ):
                # Replace {zoom} with {z}, {switch:} with first
                if "url" in props:
                    props["url"] = props["url"].replace("{zoom}", "{z}")
                    props["url"] = props["url"].replace("{height}", "256")
                    props["url"] = props["url"].replace("{width}", "256")
                    props["url"] = props["url"].replace("{bbox}", "{bbox-epsg-3857}")
                    props["url"] = props["url"].replace("{proj}", "EPSG:3857")

                    props["url"] = re.sub(
                        r"{switch:([a-zA-Z]+),.*?}", r"\1", props["url"]
                    )

                if props.get("id") in [
                    "EsriWorldImageryClarity",
                    "EsriWorldImagery",
                    "USDA-NAIP",
                    "USGS-Imagery",
                ]:
                    props["countrywide"] = True

                # Create new feature without geometry
                filtered_feature = {"type": "Feature", "properties": props}
                filtered_features.append(filtered_feature)

    # Sort filtered_features by name
    filtered_features.sort(key=lambda x: x["properties"].get("name", "").lower())

    # Create new GeoJSON with filtered features
    filtered_geojson = {"type": geojson_data["type"], "features": filtered_features}

    return filtered_geojson


def save_filtered_geojson(filtered_geojson: dict[str, Any], output_path: str) -> None:
    """
    Save filtered GeoJSON data to a file.

    Args:
        filtered_geojson: The filtered GeoJSON data to save.
        output_path: The file path where the GeoJSON should be saved.

    Raises:
        IOError: If there's an error writing to the file.
    """
    try:
        with open(output_path, "w") as file:
            json.dump(filtered_geojson, file, indent=2)
        print(f"Filtered GeoJSON saved to {output_path}")
    except Exception as e:
        print(f"Error saving file: {e}")


def main(
    url: str = "https://osmlab.github.io/editor-layer-index/imagery.geojson",
    output: str = "src/assets/filtered.json",
    input: str = "src/assets/imagery.geojson",
) -> None:
    """
    Main function to orchestrate the GeoJSON processing workflow.

    Args:
        url: The URL to fetch the GeoJSON data from.
        output: The file path where the filtered GeoJSON should be saved.
    """
    if url:
        # Fetch the GeoJSON from URL
        print("Fetching GeoJSON from URL...")
        geojson_data = fetch_geojson_from_url(url)
        if not geojson_data:
            return
    else:
        print("Reading local GeoJSON file...")
        with open(input) as geojson_file:
            geojson_data = json.load(geojson_file)

    # Filter the GeoJSON
    filtered_data = filter_geojson(geojson_data)

    if filtered_data:
        # Save the filtered GeoJSON
        save_filtered_geojson(filtered_data, output)

        # Print statistics
        original_count = len(geojson_data["features"])
        filtered_count = len(filtered_data["features"])
        print("\nStatistics:")
        print(f"Original features: {original_count}")
        print(f"Filtered features: {filtered_count}")
        print(f"Removed features: {original_count - filtered_count}")


if __name__ == "__main__":
    main()
