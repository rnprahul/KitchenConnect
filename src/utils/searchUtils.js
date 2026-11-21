/**
 * Smart search filter and sort utility.
 * 
 * When a user searches for an item (e.g., typing "M" when looking for "Mutta"):
 * 1. Items whose name starts with the search query appear at the very top (e.g. "Milk", "Mutta", "Mutton").
 * 2. Items where any word within the name starts with the search query appear next (e.g. "Fresh Milk", "Garam Masala").
 * 3. Items that contain the query anywhere in the middle appear after (e.g. "Cardamom", "Cinnamon", "Tomato").
 * 
 * Within each priority group:
 * - Exact matches appear first.
 * - Shorter matches get precedence.
 * - Remaining ties are sorted alphabetically.
 * 
 * If search query is empty or whitespace, original items array is returned.
 *
 * @param {Array} items - List of items to filter and sort
 * @param {string} search - Search query entered by user
 * @param {string|string[]} keys - Field name or array of field names to match against (default: "name")
 * @returns {Array} Filtered and intelligently sorted items
 */
export function filterAndSortBySearch(items, search, keys = "name") {
  if (!items || !Array.isArray(items)) return [];
  const query = (search || "").trim().toLowerCase();
  if (!query) return items;

  const keyList = Array.isArray(keys) ? keys : [keys];

  // Helper to get all searchable string values for an item
  const getValues = (item) => {
    if (!item) return [];
    if (typeof item === "string") return [item.toLowerCase()];
    return keyList
      .map((k) => (item[k] ? String(item[k]).toLowerCase() : ""))
      .filter(Boolean);
  };

  // Score calculation:
  // Lower score = higher relevance (appears at the top)
  const getScore = (item) => {
    const values = getValues(item);
    if (values.length === 0) return 999;

    let bestScore = 999;

    for (const val of values) {
      if (!val.includes(query)) continue;

      // Rank 0: Exact match ("Mutta" === "mutta")
      if (val === query) {
        bestScore = Math.min(bestScore, 0);
        continue;
      }

      // Rank 1: Value starts with the search query ("Mutta" starts with "m")
      if (val.startsWith(query)) {
        bestScore = Math.min(bestScore, 1);
        continue;
      }

      // Rank 2: A word inside the value starts with the search query ("Kozhi Mutta" -> "mutta" starts with "m")
      const words = val.split(/[\s,()_/-]+/).filter(Boolean);
      const wordMatchIndex = words.findIndex((w) => w.startsWith(query));
      if (wordMatchIndex !== -1) {
        // Words closer to the beginning get slightly better score (2.0, 2.05, etc.)
        bestScore = Math.min(bestScore, 2 + Math.min(wordMatchIndex * 0.05, 0.4));
        continue;
      }

      // Rank 3: Query appears somewhere inside the word (e.g. "Cardamom" contains "m")
      const charIndex = val.indexOf(query);
      bestScore = Math.min(bestScore, 3 + Math.min(charIndex * 0.01, 0.4));
    }

    return bestScore;
  };

  // Filter only items that match
  const matches = items.filter((item) => getScore(item) < 999);

  // Sort matched items
  return matches.sort((a, b) => {
    const scoreA = getScore(a);
    const scoreB = getScore(b);

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    // Tie-breaker 1: Shorter primary string value first
    const primaryKey = keyList[0];
    const valA = a && a[primaryKey] ? String(a[primaryKey]) : "";
    const valB = b && b[primaryKey] ? String(b[primaryKey]) : "";

    if (valA.length !== valB.length) {
      return valA.length - valB.length;
    }

    // Tie-breaker 2: Alphabetical
    return valA.localeCompare(valB, undefined, { sensitivity: "base" });
  });
}
