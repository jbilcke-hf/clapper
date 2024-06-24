import { BlackTrack, ConcreteProducer, Producer } from "./producer"
import { AudioTractor, trackIndexGen, Tractor, VideoTractor } from "./tractor"

export class Project {
	producers: Producer[] = [];
	tractors: Tractor[] = [];
	constructor(public fps: number) {
		this.producers.push(new BlackTrack());
	}

	addProducer(file: string): ConcreteProducer {
		const producer = new ConcreteProducer(file);
		this.producers.push(producer);
		return producer;
	}

	addAudioTractor(): AudioTractor {
		const tractor = new AudioTractor();
		this.tractors.push(tractor);
		return tractor;
	}

	addVideoTractor(): VideoTractor {
		const tractor = new VideoTractor();
		this.tractors.push(tractor);
		return tractor;
	}

	async toXML() {
		return `<?xml version='1.0' encoding='utf-8'?>
<mlt LC_NUMERIC="C" producer="main_bin" version="7.0.0" root="/home/kuba/Downloads">
 <profile frame_rate_num="${
		this.fps
 }" sample_aspect_num="1" display_aspect_den="9" colorspace="601" progressive="1" description="1920x1080 29.90fps" display_aspect_num="16" frame_rate_den="1" width="1920" height="1080" sample_aspect_den="1"/>
${(
	await Promise.all(
		this.producers.map((producer) => producer.toXML(this.fps))
	)
).join("\n")}
 <playlist id="main_bin">
  <property name="kdenlive:docproperties.activeTrack">2</property>
  <property name="kdenlive:docproperties.audioChannels">2</property>
  <property name="kdenlive:docproperties.audioTarget">1</property>
  <property name="kdenlive:docproperties.disablepreview">0</property>
  <property name="kdenlive:docproperties.documentid">1633881496938</property>
  <property name="kdenlive:docproperties.groups">[
]
</property>
  <property name="kdenlive:docproperties.kdenliveversion">21.08.1</property>
  <property name="kdenlive:docproperties.version">1.02</property>
  <property name="kdenlive:expandedFolders"/>
  <property name="kdenlive:documentnotes"/>
  <property name="xml_retain">1</property>
${this.producers
	.filter((e) => !(e instanceof BlackTrack))
	.map((producer) => `<entry producer="producer${producer.index}"/>`)
	.join("\n")}  
 </playlist>
${this.tractors.map((tractor) => tractor.toXML()).join("\n")}
 <tractor id="tractor${
		trackIndexGen.next().value
 }" in="00:00:00.000" out="00:08:20.000">
  <track producer="black_track"/>
${this.tractors
	.map((tractor) => `<track producer="tractor${tractor.index}"/>`)
	.join("\n")}
 </tractor>
</mlt>
`;
	}
}