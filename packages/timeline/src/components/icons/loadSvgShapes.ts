import { SVGLoader } from "three/examples/jsm/Addons.js"

import { SvgShape } from "./types";

// with which the threejs engine will make shapes
export async function loadSvgShapes(url: string): Promise<SvgShape[]> {
  return new Promise(resolve =>
    new SVGLoader().load(url, shapes => (
      resolve(shapes.paths.map((group, index) => (
        (group as any).toShapes(true).map((shape: any) => ({
          shape,
          color: (group.userData as any)?.style?.fill || '#ffffff',
          index
        }))
      )).flat())
    ))
  )
}