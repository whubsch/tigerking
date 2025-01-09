import React, { useState, useEffect } from "react";
import { Card } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

import TagSelection from "./TagSelection";
import CardHeading from "./CardHeading";
import { useChangesetStore } from "../stores/useChangesetStore";
import { useWayStore } from "../stores/useWayStore";
import { fetchElementTags } from "../services/osmApi";

const RelationTags: React.FC = () => {
  const [tags, setTags] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { relationId, setRelationId, setDescription } = useChangesetStore();
  const { resetWays } = useWayStore();

  const handleReset = () => {
    resetWays();
    setRelationId("");
    setTags({});
    setDescription("");
  };

  useEffect(() => {
    const loadRelationTags = async () => {
      if (!relationId) return;

      setLoading(true);
      setError(null);

      try {
        const { tags, name } = await fetchElementTags(relationId, "relation");
        setTags(tags);
        setDescription(name);
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
      <Card className="p-4">
        <div className="flex justify-center items-center">
          <Spinner label="Loading area tags..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-danger-50">
        <p className="text-danger">Error: {error}</p>
      </Card>
    );
  }

  if (Object.keys(tags).length === 0) {
    return (
      <Card className="p-4">
        <p className="text-gray-500">No tags available</p>
      </Card>
    );
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
        onReset={handleReset} // Add this prop
      />
      <TagSelection tags={tags} onTagClick={handleTagClick} scroll={true} />
    </>
  );
};

export default RelationTags;
