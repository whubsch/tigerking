import React from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Form } from "@nextui-org/form";
import { useChangesetStore } from "../stores/useChangesetStore";

interface RelationFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const RelationForm: React.FC<RelationFormProps> = ({ onSubmit }) => {
  const { relationId, setRelationId } = useChangesetStore();
  return (
    <Form onSubmit={onSubmit} id="relation-form">
      <p className="text-lg font-medium">OSM Relation ID</p>
      <Input
        isRequired
        errorMessage="Please enter a valid OSM relation ID"
        name="relation"
        placeholder="12345"
        type="number"
        value={relationId}
        onChange={(e) => setRelationId(e.target.value)}
        endContent={
          <Button
            type="submit"
            variant="solid"
            size="sm"
            color="primary"
            isDisabled={!relationId}
          >
            Submit
          </Button>
        }
      />
    </Form>
  );
};

export default RelationForm;
