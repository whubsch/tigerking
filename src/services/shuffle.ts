export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid mutating the original
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}
