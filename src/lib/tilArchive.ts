import type { TILCategory, TILEntry } from "@/types/til";

export type TILCategoryFilter = "all" | TILCategory;

export function normalizeTILSearch(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR");
}

export function getTILSearchText(entry: TILEntry) {
  return [
    entry.title,
    entry.summary,
    ...entry.learned,
    ...entry.tried,
    ...entry.blocked,
    ...entry.insights,
    ...Object.values(entry.blocks ?? {}).flatMap((blocks) => blocks.flatMap((block) =>
      block.type === "paragraph" ? [block.text] : [block.caption ?? "", block.prompt ?? "", block.type === "image" ? block.alt : block.title],
    )),
    ...entry.nextActions.map((action) => action.text),
    ...entry.skills,
    ...entry.resources.flatMap((resource) => [
      resource.title,
      resource.description ?? "",
    ]),
  ]
    .join(" ")
    .toLocaleLowerCase("ko-KR");
}

export function filterTILEntries(
  entries: readonly TILEntry[],
  category: TILCategoryFilter,
  query: string,
) {
  const normalizedQuery = normalizeTILSearch(query);

  return entries
    .filter((entry) => category === "all" || entry.category === category)
    .filter(
      (entry) =>
        !normalizedQuery || getTILSearchText(entry).includes(normalizedQuery),
    )
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export function resolveSelectedTILEntry(
  entries: readonly TILEntry[],
  requestedSlug: string | null,
) {
  if (requestedSlug) {
    const requestedEntry = entries.find((entry) => entry.slug === requestedSlug);

    if (requestedEntry) {
      return requestedEntry;
    }
  }

  return null;
}

export function formatTILDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${year}.${month}.${day}`;
}
