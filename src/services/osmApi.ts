interface ElementDetails {
  tags: Record<string, string>;
  id: number;
  type: string;
}

export const fetchElementTags = async (id: string, elementType: string) => {
  if (!id) {
    throw new Error("No ID provided");
  }

  try {
    const response = await fetch(
      `https://api.openstreetmap.org/api/0.6/${elementType}/${id}.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const elementData = data.elements[0] as ElementDetails;

    if (elementData && elementData.tags) {
      return elementData;
    } else {
      throw new Error(`No tags found for this ${elementType}`);
    }
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error(`Failed to fetch ${elementType} tags`);
  }
};
