export const findPrioritySuggestion = (word: string, suggestions: string[] | undefined): string | undefined => {
  if (!suggestions || suggestions.length === 0) return undefined;

  const levenshteinDistance = (a: string, b: string): number => {
    const dp: number[][] = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }

    return dp[a.length][b.length];
  };

  let closestSuggestion = suggestions[0];
  let minDistance = levenshteinDistance(word, closestSuggestion);
  let sameLengthCloseSuggestion = closestSuggestion;
  let foundSameLengthWithDistance1 = false;

  for (const suggestion of suggestions) {
    const distance = levenshteinDistance(word, suggestion);

    // Update closest suggestion if a smaller distance is found
    if (distance <= minDistance) {
      minDistance = distance;
      closestSuggestion = suggestion;

      // Check if the current suggestion is of the same length and distance is 1
      if (distance === 1 && suggestion.length === word.length) {
        sameLengthCloseSuggestion = suggestion;
        foundSameLengthWithDistance1 = true;
      }
    }
  }

  // If a suggestion with the same length and distance 1 was found, prefer it
  if (foundSameLengthWithDistance1) {
    closestSuggestion = sameLengthCloseSuggestion;
  }

  return closestSuggestion;
};
