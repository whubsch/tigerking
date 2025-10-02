import React, { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { OsmWay } from "../objects";
import WayAccordionItemContent from "./WayAccordionItemContent";
import { Chip } from "@heroui/chip";
import cancel from "../assets/cancel.svg";
import Icon from "./Icon";

interface WayAccordionProps {
  ways: OsmWay[];
  onRemoveWay?: (index: number) => void;
  editable?: boolean;
}

const WayAccordion: React.FC<WayAccordionProps> = ({
  ways,
  onRemoveWay = () => {},
  editable = false,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  if (ways.length === 0) {
    return <p className="text-gray-500 text-center">No ways selected</p>;
  }

  return (
    <Accordion
      isCompact
      selectionMode="multiple"
      selectedKeys={expandedKeys}
      onSelectionChange={(keys) => setExpandedKeys(keys as Set<string>)}
    >
      {ways.map((way, index) => {
        const isFlagged = way.tags["fixme:tigerking"] !== undefined;
        const isExpanded = expandedKeys.has(way.id.toString());

        return (
          <AccordionItem
            key={way.id}
            aria-label={`Way ${way.id}`}
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Chip
                    color={isFlagged ? "warning" : "success"}
                    variant="flat"
                    size="sm"
                    className="mr-3 px-2 rounded-full text-xs font-semibold"
                  >
                    {isFlagged ? "Flagged" : "Fixed"}
                  </Chip>
                  {way.tags.name ? (
                    <span className="font-medium">{way.tags.name}</span>
                  ) : (
                    <span className="text-danger font-medium">no name</span>
                  )}
                </div>
                <div className="flex items-center h-full">
                  <span className="text-gray-500 text-sm hidden md:inline">
                    {way.tags.highway}
                  </span>
                  {editable && (
                    <Button
                      isIconOnly
                      onPress={() => {
                        onRemoveWay(index);
                      }}
                      className="ml-4 hover:bg-danger p-2 rounded-full"
                      aria-label="Remove way"
                    >
                      <Icon src={cancel} alt="cancel" size="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            }
          >
            <WayAccordionItemContent way={way} isExpanded={isExpanded} />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default WayAccordion;
