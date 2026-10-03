function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\s]/g, '')
    .replace(/\s+/g, '');
}

export function similarity(target: string, heard: string): number {
  const a = normalize(target);
  const b = normalize(heard);
  if (!a || !b) return 0;

  const grams = (s: string): Set<string> => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };

  const ga = grams(a);
  const gb = grams(b);
  let inter = 0;
  ga.forEach((g) => {
    if (gb.has(g)) inter++;
  });
  return Math.min(100, Math.round((inter / Math.max(1, (ga.size + gb.size) / 2)) * 100));
}
