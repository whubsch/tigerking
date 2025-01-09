interface MapParams {
  zoom?: number;
  x?: number;
  y?: number;
  relation?: string;
  way?: string;
}

export function getMapParams(url: string) {
  const searchParams = new URLSearchParams(url);
  const params: MapParams = {};

  const zoom = searchParams.get("zoom");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const relation = searchParams.get("relation");
  const way = searchParams.get("way");

  if (zoom) params.zoom = Number(zoom);
  if (x) params.x = Number(x);
  if (y) params.y = Number(y);
  if (relation) params.relation = relation;
  if (way) params.way = way;

  const isBoundingBox = !!(params.zoom && params.x && params.y);
  const isCenterPoint = !!(params.x && params.y && !params.zoom);
  const hasRelation = !!params.relation;
  const hasWay = !!params.way;

  return {
    params,
    isBoundingBox,
    isCenterPoint,
    hasRelation,
    hasWay,
  };
}
