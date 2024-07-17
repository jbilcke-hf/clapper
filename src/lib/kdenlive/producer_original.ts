'use server'

import { $ } from 'zx'

import { makeIDGen } from './makeIDGen'

export const producerIndexGen = makeIDGen(0)

export abstract class Producer {
  index: number
  constructor(public path: string) {
    this.index = producerIndexGen.next().value
  }

  async getNativeMltXml(fps: number): Promise<string> {
    const xml = (
      await $`melt ${
        this.path
      } -consumer xml ${`frame_rate_num=${fps}`} | htmlq producer`
    ).stdout
    return xml.replace('producer0', this.id)
  }

  async toXML(fps: number): Promise<string> {
    return await this.getNativeMltXml(fps)
  }

  get id() {
    return 'producer' + this.index
  }
}

export class ConcreteProducer extends Producer {
  video_only: VideoOnlyProducer
  audio_only: AudioOnlyProducer
  constructor(path: string) {
    super(path)
    this.video_only = new VideoOnlyProducer(path)
    this.audio_only = new AudioOnlyProducer(path)
  }

  async toXML(fps: number) {
    return (
      await Promise.all([
        super.toXML(fps),
        this.video_only.toXML(fps),
        this.audio_only.toXML(fps),
      ])
    ).join('\n')
  }
}

class VideoOnlyProducer extends Producer {
  async toXML(fps: number) {
    const xml = await super.toXML(fps)
    return xml.replace(
      '</producer>',
      ` <property name="set.test_audio">0</property>
        <property name="set.test_image">1</property>
       </producer>`
    )
  }
}

class AudioOnlyProducer extends Producer {
  async toXML(fps: number) {
    const xml = await super.toXML(fps)
    return xml.replace(
      '</producer>',
      ` <property name="set.test_audio">1</property>
        <property name="set.test_image">0</property>
       </producer>`
    )
  }
}

export class BlackTrack extends Producer {
  constructor() {
    super('')
  }

  async toXML() {
    return /* HTML */ `<producer
      id="black_track"
      in="00:00:00.000"
      out="00:16:43.344"
    >
      <property name="length">2147483647</property>
      <property name="eof">continue</property>
      <property name="resource">black</property>
      <property name="aspect_ratio">1</property>
      <property name="mlt_service">color</property>
      <property name="mlt_image_format">rgb24a</property>
      <property name="set.test_audio">0</property>
    </producer>`
  }

  get id() {
    return 'black_track'
  }
}
