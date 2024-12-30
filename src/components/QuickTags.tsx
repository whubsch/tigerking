import { useEffect, useMemo } from "react";
import { Card, Kbd } from "@nextui-org/react";

interface QuickTagsProps {
  surfaceKeys: string;
  lanesKeys: string;
  onSurfaceChange: (surface: string) => void;
  onLanesChange: (lanes: string) => void;
}

const QuickTags: React.FC<QuickTagsProps> = ({
  surfaceKeys,
  lanesKeys,
  onSurfaceChange,
  onLanesChange,
}) => {
  const quickTagsData = useMemo(
    () => [
      {
        id: 1,
        surface: "asphalt",
        lanes: "none",
        keyboardShortcut: "1",
        label: "Asphalt Path",
      },
      {
        id: 2,
        surface: "compacted",
        lanes: "none",
        keyboardShortcut: "2",
        label: "Compacted Trail",
      },
      {
        id: 3,
        surface: "asphalt",
        lanes: "2",
        keyboardShortcut: "3",
        label: "Asphalt Road",
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
        onSurfaceChange(quickTag.surface);
        onLanesChange(quickTag.lanes);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onSurfaceChange, onLanesChange, quickTagsData]);

  const handleCardPress = (surface: string, lanes: string): void => {
    onSurfaceChange(surface);
    onLanesChange(lanes);
  };

  return (
    <>
      <h3 className="text-lg font-light">Quick Tags</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {quickTagsData.map((tag) => {
          const isActive =
            tag.surface === surfaceKeys && tag.lanes === lanesKeys;
          return (
            <Card
              key={tag.id}
              className={`
              transition-all duration-200
              ${
                isActive
                  ? "border-2 border-primary bg-primary/10 scale-[1.02]"
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
