# TIGER King

> I went to work every day prepared to die in a [TIGER cage](https://youtu.be/LeWcZ6WDZP4?si=9tZN0w9JqoHxUWCF).

This repository provides mappers a web application to quickly fix outdated TIGER road data in OpenStreetMap. It is not meant as a general-purpose editor, but rather to add `surface` and `lanes` tags to roadways and remove the various legacy TIGER import tags.

## Overview

TIGER King is a web application that helps OpenStreetMap contributors improve road data quality by fixing issues from the original TIGER import. The tool provides a simple interface to:

- View and edit road properties
- Compare with current aerial imagery
- Submit improvements directly to OSM

## Usage

1. Enter an OSM relation ID
2. Review and update road properties (surface, lanes, etc.)
3. Verify changes on the map
4. Submit updates to OpenStreetMap

## Requirements

- OpenStreetMap account for submitting changes

## Tech Stack

- React + TypeScript
- MapLibre GL JS
- NextUI Components
- Tailwind CSS

## Contributing

Issues and pull requests are welcome. Please read CONTRIBUTING.md for details.

## License

MIT
