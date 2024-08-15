import { Shape } from "three";

import { icons } from "./icons";

export type SvgShape = {
  shape: Shape;
  color: any;
  index: number;
}
export type IconType = keyof typeof icons