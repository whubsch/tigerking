import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useChangesetStore } from "../stores/useChangesetStore";
import fetchWikidataAdministrativeAreas from "../services/qlever"; // Adjust the import path

interface ExampleId {
  name: string;
  value: string;
}

const RelationIdPlaceholder: React.FC = () => {
  const [exampleIds, setExampleIds] = useState<ExampleId[]>([
    { name: "Ward 7", value: "16394083" },
    { name: "Harding County", value: "1832195" },
    { name: "Saginaw", value: "134509" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { setRelation } = useChangesetStore();

  useEffect(() => {
    async function loadWikidataExamples() {
      try {
        setIsLoading(true);
        const results = await fetchWikidataAdministrativeAreas(4);

        // Transform Wikidata results to our ExampleId format
        const wikidataExamples: ExampleId[] = results.map((result) => ({
          name: result.label,
          value: result.osm_id,
        }));

        // Update state with fetched examples
        setExampleIds(wikidataExamples);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch Wikidata examples:", err);
        setIsLoading(false);
      }
    }

    loadWikidataExamples();
  }, []);

  const handleLocationSelect = (id: ExampleId) => {
    setRelation({ id: id.value, name: id.name });
    window.location.href = `/tigerking/?relation=${id.value}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardBody className="flex items-center justify-center">
          <p>Loading example locations...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-col items-center gap-3 px-6 py-4">
        <h3 className="text-xl font-semibold text-default-700">
          No location selected
        </h3>
        <p className="text-sm text-default-500 text-center">
          Please select a location or choose one of the example values below:
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap justify-center gap-3">
          {exampleIds.map((id) => (
            <Button
              key={id.value}
              variant="flat"
              color="primary"
              onPress={() => handleLocationSelect(id)}
              className="px-4 py-2"
            >
              <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                {id.name}
              </span>
            </Button>
          ))}
        </div>
        <p className="text-xs text-default-400 text-center mt-4">
          Click any button above to try out the app
        </p>
      </CardBody>
    </Card>
  );
};

export default RelationIdPlaceholder;
