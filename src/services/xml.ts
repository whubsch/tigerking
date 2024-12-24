import { create } from "xmlbuilder2";
import { OsmWay } from "../objects";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

export const osmXmlBuilder = {
  /**
   * Convert OsmWay to OSM XML format
   */
  wayToXml(
    way: OsmWay,
    changeset: number,
    incrementVersion = true,
    cutTiger = true,
  ): XMLBuilder {
    const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("way", {
      id: way.id,
      version: incrementVersion ? way.version + 1 : way.version,
      changeset: changeset,
    });

    // Add node references
    way.nodes.forEach((nodeId) => {
      doc.ele("nd", { ref: nodeId });
    });

    // Add tags
    Object.entries(way.tags).forEach(([key, value]) => {
      if (value && (!cutTiger || !key.startsWith("tiger:"))) {
        // Only add tag if value exists
        doc.ele("tag", { k: key, v: value });
      }
    });

    return doc;
  },

  createChangeSet(ways: OsmWay[], changeset: number): string {
    const doc = create({ version: "1.0", encoding: "UTF-8" }).ele("osmChange", {
      version: "0.6",
    });

    // Iterate through ways
    ways.forEach((way) => {
      const wayElement = this.wayToXml(way, changeset, true, true);
      doc.ele("modify").import(wayElement); // Import the way element into the modify element
    });

    // Go back to root and end the document
    return doc
      .up() // Go back to osmChange
      .end({ prettyPrint: true, headless: true });
  },
};
