import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { Textarea } from "@heroui/input";

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Record<string, string | undefined>;
  onUpdate: (updatedTags: Record<string, string | undefined>) => void;
}

const TagsModal: React.FC<TagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onUpdate,
}) => {
  const [tagsText, setTagsText] = useState<string>("");

  // Convert tags object to formatted string when tags change
  useEffect(() => {
    const formattedTags = Object.entries(tags)
      .map(([key, value]) => `${key}=${value || ""}`)
      .join("\n");
    setTagsText(formattedTags);
  }, [tags]);

  // Handle text changes in the textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsText(e.target.value);
  };

  // Convert textarea content back to tags object and update
  const handleUpdate = () => {
    try {
      const updatedTags: Record<string, string | undefined> = {};

      tagsText.split("\n").forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          const [key, value] = trimmedLine.split("=", 2);
          if (key) {
            updatedTags[key.trim()] = value ? value.trim() : undefined;
          }
        }
      });

      onUpdate(updatedTags);
      onClose();
    } catch (error) {
      console.error("Error parsing tags:", error);
    }
  };

  return (
    <BaseModal
      modalType="narrow"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={{
        label: "Edit Tags",
        emoji: "🏷️",
        colorClass: "text-blue-600 dark:text-blue-400",
      }}
      subtitle="Modify tags directly using key=value format"
      actions={[
        {
          label: "Cancel",
          color: "danger",
          variant: "flat",
          onClick: onClose,
        },
        {
          label: "Update",
          color: "primary",
          variant: "flat",
          onClick: handleUpdate,
        },
      ]}
    >
      <div className="space-y-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Each line should contain a single tag in the format "key=value".
            Leave the value empty to set it as undefined.
          </p>
          <Textarea
            variant="bordered"
            minRows={8}
            fullWidth
            value={tagsText}
            onChange={handleTextChange}
            className="font-mono"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default TagsModal;
