import { Button, ButtonGroup } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import edit from "../assets/edit.svg";

const EDITORS = [
  {
    key: "id",
    label: "iD",
    getUrl: (type: string, id: string) =>
      `https://www.openstreetmap.org/edit?editor=id&${type}=${id}&hashtags=${encodeURIComponent("#TIGERKing")}`,
  },
  {
    key: "rapid",
    label: "Rapid",
    getUrl: (type: string, id: string) =>
      `https://rapideditor.org/edit#id=${type.charAt(0)}${id}&hashtags=${encodeURIComponent("#TIGERKing")}`,
  },
  {
    key: "josm",
    label: "JOSM",
    getUrl: (type: string, id: string) =>
      `http://localhost:8111/load_object?objects=${type.charAt(0)}${id}`,
  },
];

export const EditorLinks = ({
  elementType,
  elementId,
}: {
  elementType: string;
  elementId: string;
}) => {
  const osmLink = `https://www.openstreetmap.org/${elementType}/${elementId}`;
  const displayId = `${elementType.charAt(0)}${elementId}`;

  return (
    <ButtonGroup size="sm">
      <Button>
        <Link href={osmLink} target="_blank" className="text-sm text-current">
          {displayId}
        </Link>
      </Button>

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly>
            <img
              src={edit}
              alt="Edit"
              className="h-4 w-4 brightness-0 dark:brightness-100 dark:invert"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="OSM Editor Links">
          {EDITORS.map(({ key, label, getUrl }) => (
            <DropdownItem
              key={key}
              href={getUrl(elementType, elementId)}
              target="_blank"
            >
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};
