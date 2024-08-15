import { ClapSegment } from "@/types";
import { sanitizeSegment } from "./sanitizeSegment";

export function sanitizeSegments(maybeSegments: ClapSegment[] = []): ClapSegment[] {
  return maybeSegments.map(segment => sanitizeSegment(segment))
}