import PureUUID from "pure-uuid"

export function UUID() {
  return new PureUUID(4).format()
}