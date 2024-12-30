import React, { useState, useEffect } from "react";
import { Card, Spinner } from "@nextui-org/react";
import TagSelection from "./TagSelection";
import CardHeading from "./CardHeading";

interface RelationDetails {
  tags: Record<string, string>;
  id: number;
  type: string;
}

interface RelationTagsProps {
  relationId: string;
  setRelationName: (location: string) => void;
}

const RelationTags: React.FC<RelationTagsProps> = ({
  relationId,
  setRelationName,
}) => {
  const [tags, setTags] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelationTags = async () => {
      if (!relationId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.openstreetmap.org/api/0.6/relation/${relationId}.json`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const relationData = data.elements[0] as RelationDetails;

        if (relationData && relationData.tags) {
          setTags(relationData.tags);
          setRelationName(relationData.tags.name);
        } else {
          setError("No tags found for this relation");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch relation tags",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRelationTags();
  }, [relationId, setRelationName]);

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
      <CardHeading name={tags.name} id={relationId} type={"relation"} />
      <TagSelection tags={tags} onTagClick={handleTagClick} scroll={true} />
    </>
  );
};

export default RelationTags;
