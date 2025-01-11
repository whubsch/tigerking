# TIGER King App Parameters

The TIGER King application supports several URL parameters to configure how and what data is loaded:

## Supported Parameters

### Relation

- **Key**: `relation`
- **Description**: Loads ways within a specific OSM relation
- **Example**: `?relation=962190`
- **Usage**: Fetches all ways belonging to the specified relation ID

### Way

- **Key**: `way`
- **Description**: Loads a specific OSM way
- **Example**: `?way=8796378`
- **Usage**: Retrieves and displays the specified way for editing

### Bounding Box

- **Keys**: `zoom`, `x`, `y`
- **Description**: Specifies a geographical bounding box
- **Example**: `?zoom=16&x=38.89&y=-77.11`
- **Requirements**: All three parameters must be present
- **Usage**: Loads ways within the specified map area

### Center Point

- **Keys**: `x`, `y`
- **Description**: Specifies a center point for way discovery
- **Example**: `?x=38.89&y=-77.11`
- **Requirements**: `zoom` must be absent
- **Usage**: Finds and sorts ways around the specified geographic coordinates
