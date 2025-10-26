interface WikidataResult {
  area: string;
  label: string;
  osm_id: string;
}

interface WikidataResponse {
  head: {
    vars: string[];
  };
  results: {
    bindings: Array<{
      area: { type: string; value: string };
      label: { type: string; value: string };
      osm_id: { type: string; value: string };
    }>;
  };
}

async function fetchWikidataAdministrativeAreas(
  count: number = 3,
): Promise<WikidataResult[]> {
  try {
    const sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT DISTINCT ?area ?label ?osm_id WHERE {
  ?area wdt:P31/wdt:P279* ?type;      # instance/subclass of
        wdt:P17 wd:Q30;               # country: United States
        wdt:P402 ?osm_id.             # has OSM relation ID
  ?area rdfs:label ?label

  VALUES ?type { wd:Q47168 wd:Q17343829 }  # US administrative entity types

  FILTER (LANG(?label) = "en") .
  }
ORDER BY RAND()
LIMIT ${count}
`;

    const endpoint = "https://qlever.dev/api/wikidata/";
    const params = new URLSearchParams({
      query: sparqlQuery,
      format: "json",
    });

    const url = `${endpoint}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WikidataResponse = await response.json();

    // Transform the response to a more usable format
    const transformedResults: WikidataResult[] = data.results.bindings.map(
      (binding) => ({
        area: binding.area.value,
        label: binding.label.value,
        osm_id: binding.osm_id.value,
      }),
    );

    return transformedResults;
  } catch (error) {
    console.error("Error fetching Wikidata administrative areas:", error);
    throw error;
  }
}

export default fetchWikidataAdministrativeAreas;
