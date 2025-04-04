import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useChangesetStore } from "../stores/useChangesetStore";
import packageJson from "../../package.json";

// Define the interface for individual table items
interface TableItem {
  key: string;
  value: string;
}

// Define the props interface
interface InfoTableProps {
  description: string;
  source: string;
}

const ChangesetTagTable: React.FC<InfoTableProps> = ({
  description,
  source,
}) => {
  const { host } = useChangesetStore();
  const data: TableItem[] = [
    {
      key: "created_by",
      value: "TIGER King " + packageJson.version,
    },
    {
      key: "description",
      value: description,
    },
    {
      key: "imagery_used",
      value: source,
    },
    {
      key: "host",
      value: host,
    },
  ];

  return (
    <Table
      aria-label="Changeset tags table"
      className="px-4"
      hideHeader
      isStriped
    >
      <TableHeader>
        <TableColumn>key</TableColumn>
        <TableColumn>value</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.key}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ChangesetTagTable;
