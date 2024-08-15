import * as THREE from 'three';

import { SvgShape } from './types';
import { degToRad } from 'three/src/math/MathUtils.js';

export function SvgShapeMesh({
  shape,
  color,
  index
}: SvgShape) {
  return (
    <mesh>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial

        // we want to make the icon have the same tint as the
        // underlying segment background
        // color={color}
        color="black"
        transparent
        opacity={0.6}

        side={THREE.DoubleSide}

        depthWrite={true}
        //depthWrite={false}

        // do we still need this?
        // https://gist.github.com/PantherHawk/66c129cbda65d157186dd3b38fb427a1
        polygonOffset
        polygonOffsetFactor={index * -0.1}
      />
    </mesh>
  );
}