import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { BBox } from "../stores/useBboxStore";

interface BboxCardProps {
  bbox: BBox;
}

export const BboxCard: React.FC<BboxCardProps> = ({ bbox }) => {
  // Format numbers to 6 decimal places
  const formatNumber = (num: number) => num.toFixed(6);

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Bounding Box</CardHeader>
      <CardBody className="p-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="col-span-3">
              <span className="font-semibold">North: </span>
              {formatNumber(bbox.north)}
            </div>
            <div>
              <span className="font-semibold">West: </span>
              {formatNumber(bbox.west)}
            </div>
            <div></div>
            <div>
              <span className="font-semibold">East: </span>
              {formatNumber(bbox.east)}
            </div>
            <div className="col-span-3">
              <span className="font-semibold">South: </span>
              {formatNumber(bbox.south)}
            </div>
          </div>

          {/* <Link
            href={bboxFinderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-center mt-2"
          >
            View on Bbox Finder
          </Link> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default BboxCard;
