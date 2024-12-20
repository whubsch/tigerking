import { create } from "xmlbuilder2";
import { OsmWay } from "../objects";

export const osmXmlBuilder = {
  /**
   * Convert OsmWay to OSM XML format
   */
  wayToXml(
    way: OsmWay,
    changeset: number,
    incrementVersion = true,
    cutTiger = true,
  ): string {
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
      if (value && (!cutTiger || key.toLowerCase().startsWith("tiger:"))) {
        // Only add tag if value exists
        doc.ele("tag", { k: key, v: value });
      }
    });

    return doc.end({ prettyPrint: true });
  },
};
