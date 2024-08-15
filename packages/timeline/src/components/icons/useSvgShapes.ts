import { useEffect, useState } from "react";

import { loadSvgShapes } from "./loadSvgShapes";
import { SvgShape } from "./types";

export function useSvgShapes(url: string): SvgShape[] {
  const [shapes, set] = useState<SvgShape[]>([]);
  useEffect(() => {
    loadSvgShapes(url).then(set)
  }, [url]);
  return shapes
}