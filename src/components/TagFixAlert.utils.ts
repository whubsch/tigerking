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
  Acc: "Access",
  Aly: "Alley",
  Anx: "Anex",
  Arc: "Arcade",
  Av: "Avenue",
  Ave: "Avenue",
  Byu: "Bayou",
  Bch: "Beach",
  Bnd: "Bend",
  Blf: "Bluff",
  Blfs: "Bluffs",
  Btm: "Bottom",
  Blvd: "Boulevard",
  Br: "Branch",
  Brg: "Bridge",
  Brk: "Brook",
  Brks: "Brooks",
  Bg: "Burg",
  Bgs: "Burgs",
  Byp: "Bypass",
  Cp: "Camp",
  Cy: "Key",
  Cyn: "Canyon",
  Cpe: "Cape",
  Ctr: "Center",
  Ctrs: "Centers",
  Cir: "Circle",
  Cirs: "Circles",
  Clf: "Cliff",
  Clfs: "Cliffs",
  Clb: "Club",
  Cmn: "Common",
  Cmns: "Commons",
  Co: "County",
  Cor: "Corner",
  Cors: "Corners",
  Crse: "Course",
  Ct: "Court",
  Cts: "Courts",
  Cv: "Cove",
  Cvs: "Coves",
  Crk: "Creek",
  Cres: "Crescent",
  Crst: "Crest",
  Cswy: "Causeway",
  Curv: "Curve",
  Dl: "Dale",
  Dm: "Dam",
  Dv: "Divide",
  Dr: "Drive",
  Drs: "Drives",
  Est: "Estate",
  Expy: "Expressway",
  Expwy: "Expressway",
  Ext: "Extension",
  Exts: "Extensions",
  Fgr: "Forge",
  Fgrs: "Forges",
  Fls: "Falls",
  Fld: "Field",
  Flds: "Fields",
  Flt: "Flat",
  Flts: "Flats",
  Frd: "Ford",
  Frds: "Fords",
  Frst: "Forest",
  Frg: "Forge",
  Frgs: "Forges",
  Frk: "Fork",
  Frks: "Forks",
  Fry: "Ferry",
  Frys: "Ferrys",
  For: "Ford",
  Fors: "Fords",
  Ft: "Fort",
  Fwy: "Freeway",
  Gd: "Grade",
  Gdn: "Garden",
  Gdns: "Gardens",
  Gtwy: "Gateway",
  Gln: "Glen",
  Glns: "Glens",
  Gn: "Green",
  Gns: "Greens",
  Grn: "Green",
  Grns: "Greens",
  Grv: "Grove",
  Grvs: "Groves",
  Hbr: "Harbor",
  Hbrs: "Harbors",
  Hgwy: "Highway",
  Hvn: "Haven",
  Hts: "Heights",
  Hwy: "Highway",
  Hl: "Hill",
  Hls: "Hills",
  Holw: "Hollow",
  Inlt: "Inlet",
  Is: "Island",
  Iss: "Islands",
  Jct: "Junction",
  Jcts: "Junctions",
  Ky: "Key",
  Kys: "Keys",
  Knl: "Knoll",
  Knls: "Knolls",
  Lk: "Lake",
  Lks: "Lakes",
  Lndg: "Landing",
  Ln: "Lane",
  Lgt: "Light",
  Lgts: "Lights",
  Lf: "Loaf",
  Lck: "Lock",
  Lcks: "Locks",
  Ldg: "Lodge",
  Lp: "Loop",
  Mnr: "Manor",
  Mnrs: "Manors",
  Mdw: "Meadow",
  Mdws: "Meadows",
  Ml: "Mill",
  Mls: "Mills",
  Msn: "Mission",
  Mtwy: "Motorway",
  Mt: "Mount",
  Mtn: "Mountain",
  Mtns: "Mountains",
  Nck: "Neck",
  Orch: "Orchard",
  Opas: "Overpass",
  Pky: "Parkway",
  Pkwy: "Parkway",
  Psge: "Passage",
  Pne: "Pine",
  Pnes: "Pines",
  Pl: "Place",
  Pln: "Plain",
  Plns: "Plains",
  Plz: "Plaza",
  Pt: "Point",
  Pts: "Points",
  Prt: "Port",
  Prts: "Ports",
  Pr: "Private",
  Pvt: "Private",
  Radl: "Radial",
  Rnch: "Ranch",
  Rpd: "Rapid",
  Rpds: "Rapids",
  Rst: "Rest",
  Rdg: "Ridge",
  Rdgs: "Ridges",
  Riv: "River",
  Rd: "Road",
  Rds: "Roads",
  Rt: "Route",
  Rte: "Route",
  Shl: "Shoal",
  Shls: "Shoals",
  Shr: "Shore",
  Shrs: "Shores",
  Skwy: "Skyway",
  Spg: "Spring",
  Spgs: "Springs",
  Sq: "Square",
  Sqs: "Squares",
  Sta: "Station",
  Strm: "Stream",
  Sts: "Streets",
  Smt: "Summit",
  Srvc: "Service",
  Ter: "Terrace",
  Trwy: "Throughway",
  Thfr: "Thoroughfare",
  Trce: "Trace",
  Trak: "Track",
  Trfy: "Trafficway",
  Trl: "Trail",
  Trlr: "Trailer",
  Tunl: "Tunnel",
  Tpke: "Turnpike",
  Upas: "Underpass",
  Unp: "Underpass",
  Uns: "Unions",
  Vias: "Viaducts",
  Vly: "Valley",
  Vlys: "Valleys",
  Vw: "View",
  Vws: "Views",
  Vlg: "Village",
  Vl: "Ville",
  Wk: "Walk",
  Wkwy: "Walkway",
  Wy: "Way",
  Wl: "Well",
  Wls: "Wells",
  Xing: "Crossing",
  Xings: "Crossings",
  Xrd: "Crossroad",
  Xrds: "Crossroads",
  Yu: "Bayou",
};

// Abbreviations that should only be expanded if they appear at the end of the name
const END_ONLY_ABBREVIATIONS = new Set(["St", "Dr"]);

/**
 * Detects abbreviated street names in the name tag
 * Returns the abbreviated form, expanded form, and full expanded name if found
 */
export const detectAbbreviatedStreetName = (
  name: string | undefined,
): {
  abbreviated: string;
  expanded: string;
  fullOriginal: string;
  fullExpanded: string;
} | null => {
  if (!name) return null;

  // Build regex pattern from abbreviations, matching with optional period
  const abbreviations = Object.keys(STREET_ABBREVIATIONS);
  const pattern = abbreviations.join("|");

  let abbreviationFound: string | null = null;
  let expandedForm: string | null = null;
  let fullExpanded = name;

  // Match abbreviations with optional periods at word boundaries
  const regex = new RegExp(`\\b(${pattern})\\.?\\b`, "g");

  fullExpanded = name.replace(regex, (match, abbr, offset) => {
    // Check if this abbreviation is end-only
    const isEndOnly = END_ONLY_ABBREVIATIONS.has(abbr);

    if (isEndOnly) {
      // Check if this match is at the end of the string (ignoring trailing whitespace/period)
      const afterMatch = name.slice(offset + match.length).trim();
      if (afterMatch.length > 0) {
        // Not at the end, don't expand
        return match;
      }
    }

    // Expand the abbreviation
    const expanded = STREET_ABBREVIATIONS[abbr];
    if (expanded && !abbreviationFound) {
      abbreviationFound = abbr;
      expandedForm = expanded;
    }
    return expanded || match;
  });

  // If nothing was changed
  if (!abbreviationFound || fullExpanded === name) return null;

  return {
    abbreviated: abbreviationFound,
    expanded: expandedForm!,
    fullOriginal: name,
    fullExpanded: fullExpanded,
  };
};
