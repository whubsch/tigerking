import React from "react";
import { Chip, Link } from "@nextui-org/react";

interface TagSelectionProps {
  tags: Record<string, string | undefined>;
  commonTags?: string[]; // Make common tags configurable
  onTagClick?: (key: string, value: string) => void; // Optional click handler
}

const TagSelection: React.FC<TagSelectionProps> = ({
  tags,
  commonTags = ["type", "boundary", "admin_level", "wikidata"],
  onTagClick,
}) => {
  const sortedTags = Object.entries(tags)
    .filter(([key]) => key !== "name")
    .sort(([a], [b]) => {
      const aIndex = commonTags.indexOf(a);
      const bIndex = commonTags.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  const getTagLink = (key: string, value: string) => {
    // Keys that should link to their OSM wiki pages
    const wikiKeys = [
      "highway",
      "type",
      "boundary",
      "admin_level",
      "border_type",
    ];

    switch (key) {
      case "wikidata":
        return `https://www.wikidata.org/wiki/${value}`;
      case "wikipedia":
        return `https://wikipedia.org/wiki/${value}`;
      case "website":
        return value;
      default:
        // If it's one of the wiki keys, link to the OSM wiki
        if (wikiKeys.includes(key)) {
          return `https://wiki.openstreetmap.org/wiki/Key:${key}`;
        }
        return null;
    }
  };

  const renderChip = (key: string, value: string) => {
    const chip = (
      <Chip
        key={key}
        variant={key.startsWith("tiger") ? "bordered" : "solid"}
        className="max-w-full cursor-pointer"
        onClick={() => onTagClick?.(key, value)}
      >
        <span className="font-semibold">{key}</span>
        <span className="mx-1">=</span>
        <span className="text-default-600">{value}</span>
      </Chip>
    );

    // If it's a wikidata tag, wrap it in a link
    const link = getTagLink(key, value);
    if (link) {
      return (
        <Link key={key} href={link} target="_blank" className="no-underline">
          {chip}
        </Link>
      );
    }

    return chip;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map(
        ([key, value]) => value !== undefined && renderChip(key, value),
      )}
    </div>
  );
};

export default TagSelection;
