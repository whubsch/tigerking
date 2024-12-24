import { OsmWay } from "../objects";
import { authFetch } from "../services/auth";
import { create } from "xmlbuilder2";
import { osmXmlBuilder } from "../services/xml";
import packageJson from "../../package.json";

export const uploadChanges = async (ways: OsmWay[]) => {
  const version = packageJson.version;

  const changeset = create()
    .ele("osm")
    .ele("changeset")
    .ele("tag")
    .att("k", "created_by")
    .att("v", "TIGER King " + version)
    .up()
    .ele("tag")
    .att("k", "comment")
    .att("v", "Adding details to `tiger:reviewed=no` ways")
    .up()
    .up()
    .up();
  console.log(changeset.end({ prettyPrint: true, headless: true }));

  const changesetId: number = await authFetch({
    method: "PUT",
    path: "/api/0.6/changeset/create",
    options: { header: { "Content-Type": "text/xml; charset=utf-8" } },
    content: changeset.end({ headless: true }),
  });

  const xmlWays = osmXmlBuilder.createChangeSet(ways, changesetId);
  console.log(xmlWays);

  const diffResult: string = await authFetch({
    method: "POST",
    path: `/api/0.6/changeset/${changesetId}/upload`,
    options: { header: { "Content-Type": "text/xml; charset=utf-8" } },
    body: xmlWays,
  });
  // with body: Parser context not created.
  // with content: Version mismatch: Provided 4, server had: 3 of Way 21457547

  authFetch({
    method: "PUT",
    path: `/api/0.6/changeset/${changesetId}/close`,
  });
  console.log(changesetId, diffResult);
};
