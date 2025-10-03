import React from "react";
import WayHeading from "./WayHeading";
import SurfaceButtons from "./SurfaceButtons";
import LanesButtons from "./LanesButtons";
import QuickTags from "./QuickTags";
import UnnamedResidentialAlert from "./UnnamedResidentialAlert";
import TagFixAlert from "./TagFixAlert";
import ActionButtons from "./ActionButtons";
import { OsmWay } from "../objects";
import {
  createNameFixActions,
  createStreetAbbreviationActions,
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

  // Only show alert if there's exactly one numbered name tag and no alt_name
  if (numberedNameTags.length === 1 && !tags.alt_name) {
    const tagKey = numberedNameTags[0];
    const tagValue = tags[tagKey];
    return { tagKey, tagValue };
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
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
}) => {
  const numberedNameInfo = getNumberedNameTagInfo(way);
  const abbreviatedStreetName = detectAbbreviatedStreetName(way.tags.name);
  const showUnnamedResidentialAlert =
    !way.tags.name && way.tags.highway === "residential";

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
                Expand <code>{abbreviatedStreetName.abbreviated}</code> to{" "}
                <code>{abbreviatedStreetName.expanded}</code>
              </>
            }
            actions={createStreetAbbreviationActions(streetAbbreviationAction)}
            selectedAction={streetAbbreviationAction}
            onActionSelect={setStreetAbbreviationAction}
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
