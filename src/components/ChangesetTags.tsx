import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

// Define the interface for individual table items
interface TableItem {
  key: string;
  value: string;
}

// Define the props interface
interface InfoTableProps {
  description: string;
  source: string;
  host: string;
}

const ChangesetTagTable: React.FC<InfoTableProps> = ({
  description,
  source,
  host,
}) => {
  const data: TableItem[] = [
    {
      key: "Description",
      value: description,
    },
    {
      key: "Source",
      value: source,
    },
    {
      key: "Host",
      value: host,
    },
  ];

  return (
    <Table
      aria-label="Changeset tags table"
      classNames={{
        wrapper: "min-h-[100px]",
      }}
    >
      <TableHeader>
        <TableColumn>KEY</TableColumn>
        <TableColumn>VALUE</TableColumn>
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
