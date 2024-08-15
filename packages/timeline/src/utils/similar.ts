import { Vector3 } from "three"

export function similar(v1: Vector3, v2: Vector3, epsilon = Number.EPSILON) {

  return ( ( Math.abs( v1.x - v2.x) < epsilon ) && ( Math.abs( v1.y - v2.y ) < epsilon ) && ( Math.abs( v1.z - v2.z ) < epsilon) );
}