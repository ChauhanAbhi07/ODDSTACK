import type { Publication } from "./content-types";
export function isPreview() {
  return (
    process.env.CONTENT_MODE === "preview" ||
    (process.env.CONTENT_MODE !== "public" &&
      process.env.NODE_ENV !== "production")
  );
}
export function visibleContent<T extends { status: Publication }>(
  items: T[],
  preview = isPreview(),
): T[] {
  return items.filter((item) => preview || item.status === "published");
}
