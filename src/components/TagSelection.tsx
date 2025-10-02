import React from "react";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import tag from "../assets/tag.svg";
import { useSettingsStore } from "../stores/useSettingsStore";

import cancel from "../assets/cancel.svg";
import Icon from "./Icon";

interface TagSelectionProps {
  tags: Record<string, string | undefined>;
  commonTags?: string[]; // Make common tags configurable
  onTagClick?: (key: string, value: string) => void; // Optional click handler
  onEditClick?: () => void; // Add handler for Edit button
  scroll: boolean;
  style: "splitted" | "bordered";
}

const TagSelection: React.FC<TagSelectionProps> = ({
  tags,
  commonTags = ["type", "boundary", "admin_level", "wikidata"],
  onTagClick,
  onEditClick,
  scroll,
  style = "splitted",
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

  const wikiKeys = [
    "highway",
    "type",
    "boundary",
    "admin_level",
    "border_type",
    "ref",
  ];

  const getTagLink = (key: string, value: string) => {
    switch (key) {
      case "wikipedia":
        return `https://wikipedia.org/wiki/${value}`;
      case "website":
        return value;
      default:
        // If it's one of the wiki keys, link to the OSM wiki
        if (wikiKeys.includes(key)) {
          return `https://wiki.openstreetmap.org/wiki/Key:${key}`;
        } else if (key.endsWith("wikidata")) {
          return `https://www.wikidata.org/wiki/${value}`;
        }
        return null;
    }
  };

  const renderChip = (key: string, value: string) => {
    const isWikiKey =
      key === "wikidata" || key === "wikipedia" || key.endsWith("wikidata");
    const isOsmWikiKey = wikiKeys.includes(key);

    const chip = (
      <Chip
        key={key}
        variant={key.startsWith("tiger") ? "bordered" : "solid"}
        endContent={
          key.startsWith("tiger") ? (
            <Icon src={cancel} alt="cancel" size="w-4 h-4" />
          ) : isWikiKey ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
          ) : isOsmWikiKey ? (
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          ) : null
        }
        className="max-w-full"
        onKeyDown={() => onTagClick?.(key, value)}
      >
        <span className="font-semibold">{key}</span>
        {!key.startsWith("tiger") ? (
          <>
            <span className="mx-1">=</span>
            <span className="text-default-600">{value}</span>
          </>
        ) : null}
      </Chip>
    );

    // If it's a wikidata tag, wrap it in a link
    const link = getTagLink(key, value);
    if (link) {
      return (
        <Link
          key={key}
          href={link}
          target="_blank"
          className="no-underline cursor-pointer"
        >
          {chip}
        </Link>
      );
    }

    return chip;
  };

  const tagsContainer = sortedTags.map(
    ([key, value]) => value !== undefined && renderChip(key, value),
  );

  const { advancedMode } = useSettingsStore();

  return scroll ? (
    <Accordion
      variant={style}
      isCompact
      className={style == "bordered" ? "" : "px-0"}
      defaultExpandedKeys={[]}
    >
      <AccordionItem
        key="1"
        aria-label="Tags"
        title={
          <div className="flex justify-between items-center w-full">
            <span>{tags.highway ? tags.highway : "Tags"}</span>
            <span className="text-gray-500">{sortedTags.length}</span>
          </div>
        }
        indicator={<Icon src={tag} alt="tag" size="w-4 h-4" />}
      >
        <div className="flex flex-wrap gap-2 py-1 overflow-clip">
          {tagsContainer}
        </div>
        {advancedMode && (
          <Button
            fullWidth
            size="sm"
            variant="ghost"
            color="warning"
            className="my-2"
            onPress={onEditClick}
          >
            Edit
          </Button>
        )}
      </AccordionItem>
    </Accordion>
  ) : (
    <div className="flex flex-wrap gap-2">{tagsContainer}</div>
  );
};

export default TagSelection;
