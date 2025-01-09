import { Button } from "@nextui-org/button";
import kebab from "../assets/kebab.svg";

const toggleButton = (
  label: string,
  isActive: boolean,
  onPress?: () => void,
  isIconOnly: boolean = false,
) => (
  <Button
    key={label}
    variant="bordered"
    className={`flex-1 border-1 transition-all duration-200 ${
      isActive
        ? "bg-primary-100 shadow-lg border-primary"
        : "hover:bg-primary/10"
    }`}
    onPress={onPress}
    isIconOnly={isIconOnly}
  >
    {isIconOnly && !isActive ? (
      <img
        src={kebab}
        alt="kebab"
        className="h-6 w-6 brightness-0 dark:brightness-100 dark:invert"
      />
    ) : (
      label
    )}
  </Button>
);

export default toggleButton;
