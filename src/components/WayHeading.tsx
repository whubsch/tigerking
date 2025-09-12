import React from "react";
import CardHeading from "./CardHeading";
import TagSelection from "./TagSelection";
import { Tags } from "../objects";
import TagsModal from "./modals/TagsModal";

interface WayHeadingProps {
  tags: Tags;
  wayId: string;
  onTagsUpdate?: (updatedTags: Record<string, string | undefined>) => void;
}

const WayHeading: React.FC<WayHeadingProps> = ({
  tags,
  wayId,
  onTagsUpdate,
}) => {
  const [showTagsModal, setShowTagsModal] = React.useState(false);

  const handleOpenTagsModal = () => {
    setShowTagsModal(true);
  };

  const handleCloseTagsModal = () => {
    setShowTagsModal(false);
  };

  const handleTagsUpdate = (
    updatedTags: Record<string, string | undefined>,
  ) => {
    if (onTagsUpdate) {
      onTagsUpdate(updatedTags);
    }
    setShowTagsModal(false);
  };

  return (
    <>
      <TagsModal
        isOpen={showTagsModal}
        onClose={handleCloseTagsModal}
        tags={tags}
        onUpdate={handleTagsUpdate}
      />
      <div className="gap-2 flex-none">
        <CardHeading
          name={tags.name ? tags.name : ""}
          id={wayId}
          type={"way"}
        />
        <TagSelection
          tags={tags}
          scroll={true}
          style="bordered"
          onEditClick={handleOpenTagsModal}
        />
      </div>
    </>
  );
};

export default WayHeading;
