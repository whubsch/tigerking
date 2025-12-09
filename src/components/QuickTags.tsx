import { useEffect, useMemo, useCallback } from "react";
import { Card } from "@heroui/card";
import { Kbd } from "@heroui/kbd";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import { Tooltip } from "@heroui/tooltip";

interface QuickTag {
  id: number;
  surface: string;
  lanes: string;
  keyboardShortcut: string;
}

const QuickTags: React.FC = () => {
  const {
    surface,
    setSurface,
    lanes,
    setLanes,
    laneMarkings,
    setLaneMarkings,
  } = useWayTagsStore();

  const QUICK_TAGS: QuickTag[] = useMemo(
    () => [
      { id: 1, surface: "asphalt", lanes: "none", keyboardShortcut: "1" },
      { id: 2, surface: "compacted", lanes: "∅", keyboardShortcut: "2" },
      { id: 3, surface: "asphalt", lanes: "2", keyboardShortcut: "3" },
    ],
    [],
  );

  const applyQuickTag = useCallback(
    (tag: QuickTag) => {
      setSurface(tag.surface);
      if (tag.lanes === "none") {
        setLaneMarkings(false);
      } else if (tag.lanes === "2") {
        setLanes(tag.lanes);
      } else {
        setLanes("");
        setLaneMarkings(true);
      }
    },
    [setSurface, setLanes, setLaneMarkings],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const quickTag = QUICK_TAGS.find(
        (tag) => tag.keyboardShortcut === event.key,
      );
      if (quickTag) applyQuickTag(quickTag);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setSurface, setLanes, QUICK_TAGS, setLaneMarkings, applyQuickTag]);

  const isTagActive = (tag: QuickTag) =>
    tag.surface === surface &&
    (tag.lanes === lanes ||
      (tag.lanes === "none" && !laneMarkings) ||
      (tag.lanes === "∅" && lanes === "" && laneMarkings));

  const renderTagTooltip = (tag: QuickTag) => (
    <Tooltip
      key={tag.id}
      content={
        <p>
          Key: <Kbd>{tag.keyboardShortcut}</Kbd>
        </p>
      }
      delay={1000}
    >
      <Card
        className={`
          transition-all duration-200
          ${
            isTagActive(tag)
              ? "outline outline-2 outline-primary bg-primary/10 shadow-lg"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md"
          }
        `}
        isPressable
        onPress={() => applyQuickTag(tag)}
      >
        <div className="p-3 gap-1 text-sm flex flex-col">
          <span className="flex">{tag.surface}</span>
          <span className={`flex ${tag.lanes === "∅" ? "opacity-50" : ""}`}>
            {tag.lanes}
          </span>
        </div>
      </Card>
    </Tooltip>
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {QUICK_TAGS.map(renderTagTooltip)}
    </div>
  );
};

export default QuickTags;
