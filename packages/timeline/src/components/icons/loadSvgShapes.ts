import { SVGLoader } from "three/examples/jsm/Addons.js"

import { SvgShape } from "./types";

// with which the threejs engine will make shapes
export async function loadSvgShapes(url: string): Promise<SvgShape[]> {
  return new Promise(resolve =>
    new SVGLoader().load(url, shapes => (
      resolve(shapes.paths.map((group, index) => (
        group.toShapes(true).map(shape => ({
          shape,
          color: group.userData?.style.fill || '#ffffff',
          index
        }))
      )).flat())
    ))
  )
}