import React, { useState, useEffect } from "react";
import { OsmWay } from "../objects";
import { fetchElementTags } from "../services/osmApi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Alert } from "@heroui/alert";

interface WayAccordionItemContentProps {
  way: OsmWay;
  isExpanded: boolean;
}

const WayAccordionItemContent: React.FC<WayAccordionItemContentProps> = ({
  way,
  isExpanded,
}) => {
  const [fetchedTags, setFetchedTags] = useState<Record<string, string> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      // Only fetch if expanded and we don't already have fetched tags
      if (isExpanded && !fetchedTags) {
        try {
          setIsLoading(true);
          const result = await fetchElementTags(way.id.toString(), "way");
          setFetchedTags(result.tags);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch tags");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTags();
  }, [isExpanded, way.id, fetchedTags]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <span className="loading-spinner">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-800">
        {error}
      </div>
    );
  }

  // Compare tags
  const compareTagChanges = () => {
    const oldTags = fetchedTags || {}; // Server tags (old version)
    const newTags = way.tags; // Local tags (new version)

    // Collect all unique keys
    const allKeys = new Set([...Object.keys(oldTags), ...Object.keys(newTags)]);

    return Array.from(allKeys)
      .filter((key) => key !== "fixme:tigerking")
      .map((key) => {
        const oldValue = oldTags[key];
        const newValue = newTags[key];

        let status: "added" | "removed" | "changed" | "unchanged" = "unchanged";

        if (!oldValue && newValue) status = "added";
        else if (!newValue && oldValue) status = "removed";
        else if (oldValue !== newValue) status = "changed";

        return {
          tag: key,
          oldValue: oldValue || "",
          newValue: newValue || "",
          status,
        };
      });
  };

  const tagChanges = compareTagChanges();
  const isFlagged = way.tags?.["fixme:tigerking"] !== undefined;

  const statusClassMap = {
    unchanged: "hover:bg-gray-100 dark:hover:bg-gray-800",
    added:
      "bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800",
    removed: "bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800",
    changed:
      "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800",
  };

  return (
    <div className="space-y-4">
      {isFlagged && way.tags?.["fixme:tigerking"] && (
        <Alert
          color="warning"
          title={"Flagging reason:"}
          description={way.tags["fixme:tigerking"]}
        />
      )}

      <Table aria-label="Tag changes" isCompact hideHeader>
        <TableHeader>
          <TableColumn>Tag</TableColumn>
          <TableColumn>Old Value</TableColumn>
          <TableColumn>New Value</TableColumn>
        </TableHeader>
        <TableBody>
          {tagChanges.map((change) => (
            <TableRow
              key={change.tag}
              className={statusClassMap[change.status]}
            >
              <TableCell className="font-medium">{change.tag}</TableCell>
              <TableCell
                className={
                  change.status === "removed"
                    ? "text-gray-500 dark:text-gray-300"
                    : ""
                }
              >
                {change.oldValue}
              </TableCell>
              <TableCell
                className={change.status === "added" ? "font-bold" : ""}
              >
                {change.newValue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WayAccordionItemContent;
