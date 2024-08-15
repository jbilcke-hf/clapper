import { Entry } from './entry'
import { makeIDGen } from './makeIDGen'

export const playlistIndexGen = makeIDGen(0)

export abstract class Playlist {
  public entries: Entry[] = []
  constructor(public index = playlistIndexGen.next().value) {}

  abstract toXML(): string

  addEntry(entry: Entry) {
    this.entries.push(entry)
  }

  renderEntries() {
    return this.entries.map((e) => e.toXML()).join('\n')
  }
}

export class AudioPlaylist extends Playlist {
  toXML() {
    return /* HTML */ `<playlist id="playlist${this.index}">
      <property name="kdenlive:audio_track">1</property>
      ${this.renderEntries()}
    </playlist>`
  }
}

export class VideoPlaylist extends Playlist {
  toXML() {
    return /* HTML */ ` <playlist id="playlist${this.index}">
      ${this.renderEntries()}
    </playlist>`
  }
}
