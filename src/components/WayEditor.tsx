import React from "react";
import WayHeading from "./WayHeading";
import SurfaceButtons from "./SurfaceButtons";
import LanesButtons from "./LanesButtons";
import QuickTags from "./QuickTags";
import UnnamedResidentialAlert from "./UnnamedResidentialAlert";
import TagFixAlert from "./TagFixAlert";
import ActionButtons from "./ActionButtons";
import { OsmWay, UNPAVED_SURFACES } from "../objects";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import {
  createNameFixActions,
  createStreetAbbreviationActions,
  createLaneTagFixActions,
  detectAbbreviatedStreetName,
} from "./TagFixAlert.utils";

interface WayEditorProps {
  way: OsmWay;
  onTagsUpdate: (updatedTags: Record<string, string | undefined>) => void;
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  convertDriveway: string;
  setConvertDriveway: (value: string) => void;
  nameFixAction: string;
  setNameFixAction: (action: string) => void;
  streetAbbreviationAction: string;
  setStreetAbbreviationAction: (action: string) => void;
  laneTagFixAction: string;
  setLaneTagFixAction: (action: string) => void;
  onSkip: () => void;
  onFix: (message: string) => void;
  onClearTiger: () => void;
  onSubmit: () => void;
}

const getNumberedNameTagInfo = (way: OsmWay) => {
  if (!way?.tags) return null;

  const tags = way.tags;

  // Find all name_ tags that end with a digit
  const numberedNameTags = Object.keys(tags)
    .filter((key) => /^name_\d+$/.test(key))
    .sort();

  // Only show alert if there's exactly one numbered name tag, no alt_name, and the numbered name is not the same as the name
  if (
    numberedNameTags.length === 1 &&
    !tags.alt_name &&
    numberedNameTags[0] !== "name"
  ) {
    const tagKey = numberedNameTags[0];
    const tagValue = tags[tagKey];
    return { tagKey, tagValue };
  }

  return null;
};

const getUnpavedLaneTagInfo = (way: OsmWay, surface: string) => {
  if (!way?.tags || !surface) return null;

  // Check if current surface is unpaved
  const isUnpavedSurface = UNPAVED_SURFACES.includes(surface);
  if (!isUnpavedSurface) return null;

  const tags = way.tags;

  // Check if way has lane tags
  const hasLaneTags = Boolean(
    tags.lanes ||
      tags["lanes:forward"] ||
      tags["lanes:backward"] ||
      tags.lane_markings,
  );

  if (hasLaneTags) {
    const laneTags = [
      tags.lanes && "lanes",
      tags["lanes:forward"] && "lanes:forward",
      tags["lanes:backward"] && "lanes:backward",
      tags.lane_markings && "lane_markings",
    ].filter(Boolean);
    console.log(laneTags);

    return { laneTags };
  }

  return null;
};

const WayEditor: React.FC<WayEditorProps> = ({
  way,
  onTagsUpdate,
  showLaneDirection,
  setShowLaneDirection,
  convertDriveway,
  setConvertDriveway,
  nameFixAction,
  setNameFixAction,
  streetAbbreviationAction,
  setStreetAbbreviationAction,
  laneTagFixAction,
  setLaneTagFixAction,
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
}) => {
  const { surface } = useWayTagsStore();
  const numberedNameInfo = getNumberedNameTagInfo(way);
  const abbreviatedStreetName = detectAbbreviatedStreetName(way.tags.name);
  const showUnnamedResidentialAlert =
    !way.tags.name && way.tags.highway === "residential";
  const unpavedLaneTagInfo = getUnpavedLaneTagInfo(
    way,
    surface || way.tags.surface || "",
  );

  return (
    <>
      <WayHeading
        tags={way.tags}
        wayId={way.id?.toString() ?? ""}
        onTagsUpdate={onTagsUpdate}
      />
      <div className="flex flex-col gap-2 md:grow">
        <div className="py-2 flex flex-col gap-4">
          <SurfaceButtons />
          <LanesButtons
            showLaneDirection={showLaneDirection}
            setShowLaneDirection={setShowLaneDirection}
            currentTags={way.tags}
          />
        </div>
      </div>
      <div className="flex-none">
        {showUnnamedResidentialAlert && (
          <UnnamedResidentialAlert
            convertDriveway={convertDriveway}
            onConvertDriveway={setConvertDriveway}
          />
        )}
        {numberedNameInfo && (
          <TagFixAlert
            title="Fix name tagging"
            description={
              <>
                Move the <code>{numberedNameInfo.tagKey}</code> tag to{" "}
                <code>alt_name</code>
              </>
            }
            actions={createNameFixActions(nameFixAction)}
            selectedAction={nameFixAction}
            onActionSelect={setNameFixAction}
            highlightColor="warning"
          />
        )}
        {abbreviatedStreetName && (
          <TagFixAlert
            title="Expand street abbreviation"
            description={
              <>
                Expand <code>name</code> to{" "}
                <code>{abbreviatedStreetName.fullExpanded}</code>
              </>
            }
            actions={createStreetAbbreviationActions(streetAbbreviationAction)}
            selectedAction={streetAbbreviationAction}
            onActionSelect={setStreetAbbreviationAction}
            highlightColor="warning"
          />
        )}
        {unpavedLaneTagInfo && (
          <TagFixAlert
            title="Lane tags on unpaved surface"
            description={
              <>
                Unpaved surfaces typically don't have lane markings. Remove{" "}
                {unpavedLaneTagInfo.laneTags.map((tag, index) => (
                  <span key={tag}>
                    <code>{tag}</code>
                    {index < unpavedLaneTagInfo.laneTags.length - 1 && ", "}
                  </span>
                ))}
                ?
              </>
            }
            actions={createLaneTagFixActions(laneTagFixAction)}
            selectedAction={laneTagFixAction}
            onActionSelect={setLaneTagFixAction}
            highlightColor="warning"
          />
        )}
        <QuickTags />
        <ActionButtons
          onSkip={onSkip}
          onFix={onFix}
          onClearTiger={onClearTiger}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
};

export default WayEditor;
