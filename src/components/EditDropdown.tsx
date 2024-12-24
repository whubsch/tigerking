import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from "@nextui-org/react";
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
      url: `https://www.openstreetmap.org/edit?editor=id&${elementType}=w${elementId}`,
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
      <Button
        href={`https://www.openstreetmap.org/${elementType}/${elementId}`}
        target="_blank"
      >{`${elementType.charAt(0)}${elementId}`}</Button>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly>
            <img src={edit} className="h-4 w-4" />
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
