import { ReactProps } from "@react-three/fiber";
import { Group } from "three";

import { ClapSegmentCategory } from "@aitube/clap";

import { useSvgShapes } from "./useSvgShapes";
import { SvgShapeMesh } from "./SvgShapeMesh";
import { segmentCategoryToIconPath } from "./segmentIcons";

export function SegmentIcon({
  category = ClapSegmentCategory.GENERIC,
  groupProps = {}
}: {
  category?: ClapSegmentCategory
  groupProps?: ReactProps<Group>
}) {
  const iconUrl = segmentCategoryToIconPath[category]
  const shapes = useSvgShapes(iconUrl)

  return (
    <group
      // there is something wrong somewhere..
      // could be the scale, position or rotation
      // or maybe it is because the svg only contains lines
      // and no "shape"
      // scale={[30, 30, 1]}
      position={[0, 0, 10]}
      // rotation={[degToRad(0), degToRad(180), degToRad(180)]}
      {...groupProps}>
      {shapes.map(item =>  
        <SvgShapeMesh key={item.shape.uuid} {...item} />
      )}
    </group>
  );
}