import { useContext } from "react";
import { OsmAuthContext } from "./OsmAuthContextDef";

export const useOsmAuthContext = () => useContext(OsmAuthContext);
