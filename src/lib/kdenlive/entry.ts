import { Producer } from "./producer"

export class Entry {
  constructor(
    public producer: Producer,
    public in_point: string,
    public out_point: string
  ) {}

  toXML(): string {
    return /* HTML */ `<entry
      producer="${this.producer.id}"
      in="${this.in_point}"
      out="${this.out_point}"
    ></entry>`;
  }
}