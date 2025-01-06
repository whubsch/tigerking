import React from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useChangesetStore } from "../stores/useChangesetStore";

const RelationIdPlaceholder: React.FC = () => {
  const exampleIds = [
    { name: "Ward 7", value: "16394083" },
    { name: "Harding County", value: "1832195" },
    { name: "Saginaw", value: "134509" },
  ];
  const { setRelationId } = useChangesetStore();

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-col items-center gap-3 px-6 py-4">
        <h3 className="text-xl font-semibold text-default-700">
          No Relation ID Selected
        </h3>
        <p className="text-sm text-default-500 text-center">
          Please enter a relation ID or choose one of the example values below:
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap justify-center gap-3">
          {exampleIds.map((id) => (
            <Button
              key={id.value}
              variant="flat"
              color="primary"
              onPress={() => setRelationId(id.value)}
              className="px-4 py-2"
            >
              {id.name}
            </Button>
          ))}
        </div>
        <p className="text-xs text-default-400 text-center mt-4">
          Click any button above to set the relation ID
        </p>
      </CardBody>
    </Card>
  );
};

export default RelationIdPlaceholder;
