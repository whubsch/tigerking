import { TagFixAction } from "./TagFixAlert";
import check from "../assets/check.svg";
import ban from "../assets/ban.svg";
import trash from "../assets/trash.svg";
import edit from "../assets/edit.svg";

/**
 * Helper utilities for creating common TagFixAlert action configurations
 */

/**
 * Creates a standard set of actions for tag fixes: Accept, Reject, Delete
 */
export const createStandardFixActions = (
  selectedAction: string,
): TagFixAction[] => [
  {
    action: "accept",
    src: check,
    alt: "accept",
    tooltip: "Accept fix",
    color: selectedAction === "accept" ? "success" : "default",
  },
  {
    action: "reject",
    src: ban,
    alt: "reject",
    tooltip: "Reject fix",
    color: selectedAction === "reject" ? "primary" : "default",
  },
  {
    action: "delete",
    src: trash,
    alt: "delete",
    tooltip: "Delete tag",
    color: selectedAction === "delete" ? "danger" : "default",
  },
];

/**
 * Creates actions for name tag fixes: Check (accept), Ban (reject), Trash (delete)
 */
export const createNameFixActions = (
  selectedAction: string,
): TagFixAction[] => [
  {
    action: "check",
    src: check,
    alt: "check",
    tooltip: "Accept fix",
    color: selectedAction === "check" ? "warning" : "default",
  },
  {
    action: "ban",
    src: ban,
    alt: "ban",
    tooltip: "Reject fix",
    color: selectedAction === "ban" ? "primary" : "default",
  },
  {
    action: "trash",
    src: trash,
    alt: "trash",
    tooltip: "Delete tag",
    color: selectedAction === "trash" ? "danger" : "default",
  },
];

/**
 * Creates a simple yes/no action set
 */
export const createYesNoActions = (
  selectedAction: string,
  yesLabel: string = "Yes",
  noLabel: string = "No",
): TagFixAction[] => [
  {
    action: "yes",
    src: check,
    alt: "yes",
    tooltip: yesLabel,
    color: selectedAction === "yes" ? "success" : "default",
  },
  {
    action: "no",
    src: ban,
    alt: "no",
    tooltip: noLabel,
    color: selectedAction === "no" ? "default" : "default",
  },
];

/**
 * Creates actions for editing: Apply, Edit, Skip
 */
export const createEditActions = (selectedAction: string): TagFixAction[] => [
  {
    action: "apply",
    src: check,
    alt: "apply",
    tooltip: "Apply changes",
    color: selectedAction === "apply" ? "primary" : "default",
  },
  {
    action: "edit",
    src: edit,
    alt: "edit",
    tooltip: "Edit manually",
    color: selectedAction === "edit" ? "warning" : "default",
  },
  {
    action: "skip",
    src: ban,
    alt: "skip",
    tooltip: "Skip this fix",
    color: selectedAction === "skip" ? "default" : "default",
  },
];

/**
 * Creates a custom action set with flexible configuration
 */
export const createCustomActions = (
  configs: Array<{
    action: string;
    icon: string;
    tooltip: string;
    color?: TagFixAction["color"];
    activeColor?: TagFixAction["color"];
  }>,
  selectedAction: string,
): TagFixAction[] => {
  return configs.map((config) => ({
    action: config.action,
    src: config.icon,
    alt: config.action,
    tooltip: config.tooltip,
    color:
      selectedAction === config.action
        ? (config.activeColor ?? "primary")
        : (config.color ?? "default"),
  }));
};

/**
 * Creates actions for street name abbreviation fixes: Expand, Keep
 */
export const createStreetAbbreviationActions = (
  selectedAction: string,
): TagFixAction[] => [
  {
    action: "expand",
    src: check,
    alt: "expand",
    tooltip: "Expand abbreviation",
    color: selectedAction === "expand" ? "warning" : "default",
  },
  {
    action: "keep",
    src: ban,
    alt: "keep",
    tooltip: "Keep as is",
    color: selectedAction === "keep" ? "primary" : "default",
  },
];

/**
 * Common street type abbreviations and their expanded forms
 */
const STREET_ABBREVIATIONS: Record<string, string> = {
  St: "Street",
  Ave: "Avenue",
  Rd: "Road",
  Dr: "Drive",
  Blvd: "Boulevard",
  Ln: "Lane",
  Ct: "Court",
  Pl: "Place",
  Cir: "Circle",
  Pkwy: "Parkway",
  Hwy: "Highway",
  Trl: "Trail",
  Ter: "Terrace",
};

// Abbreviations that should only be expanded if they appear at the end of the name
const END_ONLY_ABBREVIATIONS = new Set(["St", "Dr"]);

/**
 * Detects abbreviated street names in the name tag
 * Returns the abbreviated form, expanded form, and full expanded name if found
 */
export const detectAbbreviatedStreetName = (
  name: string | undefined,
): { abbreviated: string; expanded: string; fullExpanded: string } | null => {
  if (!name) return null;

  const words = name.split(/\s+/);
  let abbreviationFound: string | null = null;
  const expandedName = [...words];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    const isEnd = i === words.length - 1;
    const expanded = STREET_ABBREVIATIONS[word];
    if (!expanded) continue;

    const isEndOnly = END_ONLY_ABBREVIATIONS.has(word);
    if (isEndOnly && !isEnd) {
      continue; // skip this occurrence
    }

    // Expand the abbreviation
    expandedName[i] = expanded;
    abbreviationFound = word;

    // If it's an end-only abbreviation, we stop after processing it
    if (isEndOnly) break;
  }

  // If nothing was changed
  if (!abbreviationFound) return null;

  return {
    abbreviated: abbreviationFound,
    expanded: STREET_ABBREVIATIONS[abbreviationFound],
    fullExpanded: expandedName.join(" "),
  };
};
