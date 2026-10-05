// Compare closed intervals within one meter/site. Adjacent intervals do not overlap.
// Independent channels must use distinct meter identities before normalization.
export function overlappingIntervalIndexes(intervals) {
  const groups = new Map();
  intervals.forEach((row, index) => {
    const key = JSON.stringify([row.meter_id || null, row.site_id || null]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ start: Date.parse(row.window_start), end: Date.parse(row.window_end), index });
  });
  const overlaps = [];
  for (const rows of groups.values()) {
    const seen = new Set();
    rows.sort((a, b) => a.start - b.start || a.end - b.end);
    let latestEnd = -Infinity;
    for (const row of rows) {
      const identity = JSON.stringify([row.start, row.end]);
      if (seen.has(identity) || (row.start < row.end && row.start < latestEnd)) overlaps.push(row.index);
      seen.add(identity);
      latestEnd = Math.max(latestEnd, row.end);
    }
  }
  return overlaps.sort((a, b) => a - b);
}
