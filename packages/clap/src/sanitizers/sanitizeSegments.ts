import { ClapSegment } from "@/types";
import { sanitizeSegment } from "@/sanitizers/sanitizeSegment";

export function sanitizeSegments(maybeSegments: ClapSegment[] = []): ClapSegment[] {
  return maybeSegments.map(segment => sanitizeSegment(segment))
}