import React from "react";
import { Button, Form, Input } from "@nextui-org/react";

interface RelationFormProps {
  relationId: string;
  setRelationId: (id: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const RelationForm: React.FC<RelationFormProps> = ({
  relationId,
  setRelationId,
  onSubmit,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid OSM relation ID"
        label="OSM Relation ID"
        labelPlacement="outside"
        name="relation"
        placeholder="12345"
        type="number"
        value={relationId}
        onChange={(e) => setRelationId(e.target.value)}
      />
      <Button type="submit" variant="bordered" className="w-full">
        Submit
      </Button>
    </Form>
  );
};

export default RelationForm;
