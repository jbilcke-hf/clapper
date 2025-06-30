import { ReactProps } from "@react-three/fiber";
import { Group } from "three";

import { useSvgShapes } from "./useSvgShapes";
import { SvgShapeMesh } from "./SvgShapeMesh";
import { IconType } from "./types";
import { icons } from "./icons";


export function SvgIcon({
  icon = "misc",
  groupProps = {}
}: {
  icon?: IconType
  groupProps?: ReactProps<Group>
}) {
  const iconUrl = icons[icon]
  const shapes = useSvgShapes(iconUrl)

  return (
    <group {...groupProps}>
      {shapes.map(item =>  
        <SvgShapeMesh key={item.shape.uuid} {...item} />
      )}
    </group>
  );
}