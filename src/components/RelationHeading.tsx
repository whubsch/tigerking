import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";

import TagSelection from "./TagSelection";
import CardHeading from "./CardHeading";
import { useChangesetStore } from "../stores/useChangesetStore";
import { fetchElementTags } from "../services/osmApi";

const RelationTags: React.FC = () => {
  const [tags, setTags] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { relationId, setDescription } = useChangesetStore();

  useEffect(() => {
    const loadRelationTags = async () => {
      if (!relationId) return;

      setLoading(true);
      setError(null);

      try {
        const { tags } = await fetchElementTags(relationId, "relation");
        setTags(tags);
        setDescription(tags?.name || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch relation tags",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRelationTags();
  }, [relationId, setDescription]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner label="Loading area tags..." />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  if (Object.keys(tags).length === 0) {
    return <p className="text-gray-500">No tags available</p>;
  }

  const handleTagClick = (key: string, value: string) => {
    console.log(`Clicked tag: ${key}=${value}`);
    // Add any tag click handling logic here
  };

  return (
    <>
      <CardHeading
        name={tags.name}
        id={relationId}
        type="relation"
        sendHome={true}
      />
      <TagSelection tags={tags} onTagClick={handleTagClick} scroll={true} />
    </>
  );
};

export default RelationTags;
