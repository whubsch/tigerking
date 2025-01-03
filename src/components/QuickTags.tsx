import { useEffect, useMemo } from "react";
import { Card } from "@nextui-org/card";
import { Kbd } from "@nextui-org/kbd";
import { useWayTagsStore } from "../stores/useWayTagsStore";

const QuickTags: React.FC = () => {
  const { surface, setSurface, lanes, setLanes } = useWayTagsStore();
  const quickTagsData = useMemo(
    () => [
      {
        id: 1,
        surface: "asphalt",
        lanes: "none",
        keyboardShortcut: "1",
      },
      {
        id: 2,
        surface: "compacted",
        lanes: "none",
        keyboardShortcut: "2",
      },
      {
        id: 3,
        surface: "asphalt",
        lanes: "2",
        keyboardShortcut: "3",
      },
    ],
    [],
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const quickTag = quickTagsData.find(
        (tag) => tag.keyboardShortcut === event.key,
      );
      if (quickTag) {
        setSurface(quickTag.surface);
        setLanes(quickTag.lanes);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setSurface, setLanes, quickTagsData]);

  const handleCardPress = (surface: string, lanes: string): void => {
    setSurface(surface);
    setLanes(lanes);
  };

  return (
    <>
      <h3 className="text-lg font-light">Quick Tags</h3>
      <div className="grid grid-cols-3 gap-4">
        {quickTagsData.map((tag) => {
          const isActive = tag.surface === surface && tag.lanes === lanes;
          return (
            <Card
              key={tag.id}
              className={`
              transition-all duration-200
              ${
                isActive
                  ? "outline outline-2 outline-primary bg-primary/10"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
              isPressable
              onPress={() => handleCardPress(tag.surface, tag.lanes)}
            >
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <Kbd className="hidden md:block">{tag.keyboardShortcut}</Kbd>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium">Surface:</span> */}
                    <span>{tag.surface}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <span className="font-medium">Lanes:</span> */}
                    <span>{tag.lanes}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default QuickTags;
