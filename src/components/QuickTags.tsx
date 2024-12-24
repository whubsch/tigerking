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
  console.log(surfaceKeys, lanesKeys);

  // Define the quick tags data
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
    [], // Empty dependency array since this data is static
  );

  // Keyboard event handler
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
    <div className="flex gap-4">
      {quickTagsData.map((tag) => (
        <Card
          key={tag.id}
          className={
            tag.surface === surfaceKeys && tag.lanes === lanesKeys
              ? "p-4 cursor-pointer bg-gray-100 dark:bg-gray-900 shadow-sm shadow-gray-500"
              : "p-4 cursor-pointer"
          }
          isPressable
          onPress={() => handleCardPress(tag.surface, tag.lanes)}
        >
          <div className="flex gap-2 text-sm text-left">
            <Kbd>{tag.keyboardShortcut}</Kbd>
            <span>surface={tag.surface}</span>
            <span>lanes={tag.lanes}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickTags;
