import { Button, ButtonGroup } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import edit from "../assets/edit.svg";

interface EditorLinksProps {
  elementType: string;
  elementId: string;
}

interface Editor {
  key: string;
  label: string;
  url: string;
}

export const EditorLinks: React.FC<EditorLinksProps> = ({
  elementType,
  elementId,
}) => {
  const editors: Editor[] = [
    {
      key: "id",
      label: "iD",
      url: `https://www.openstreetmap.org/edit?editor=id&${elementType}=${elementId}`,
    },
    {
      key: "rapid",
      label: "Rapid",
      url: `https://rapideditor.org/edit#id=${elementType.charAt(0)}${elementId}`,
    },
    {
      key: "josm",
      label: "JOSM",
      url: `http://localhost:8111/load_object?objects=${elementType.charAt(0)}${elementId}`,
    },
  ];

  return (
    <ButtonGroup size="sm">
      <Button>
        <Link
          href={`https://www.openstreetmap.org/${elementType.toLowerCase()}/${elementId}`}
          target="_blank"
          className="text-sm text-current"
        >
          {`${elementType.charAt(0)}${elementId}`}
        </Link>
      </Button>

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly>
            <img
              src={edit}
              className="h-4 w-4 brightness-0 dark:brightness-100 dark:invert"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="OSM Editor Links">
          {editors.map((editor) => (
            <DropdownItem key={editor.key} href={editor.url} target="_blank">
              {editor.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};
