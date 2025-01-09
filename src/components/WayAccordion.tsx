import React, { useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { OsmWay } from "../objects";
import WayAccordionItemContent from "./WayAccordionItemContent";
import { Chip } from "@nextui-org/react";

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
                  <span className="font-medium">w{way.id}</span>
                </div>
                {editable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWay(index);
                    }}
                    className="ml-4 text-red-500 hover:bg-red-50 p-2 rounded-full"
                    aria-label="Remove way"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
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
