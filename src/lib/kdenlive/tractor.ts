import { Entry } from "./entry"
import { AudioPlaylist, Playlist, VideoPlaylist } from "./playlist"
import { makeIDGen } from "./makeIDGen"

export const trackIndexGen = makeIDGen(0);

export abstract class Tractor {
	main_playlist!: Playlist;
	secondary_playlist!: Playlist; // not sure what these are for, but Kdenlive generates them, sooo
	public index = trackIndexGen.next().value;

	abstract toXML(): string;

	addEntry(entry: Entry): this {
		this.main_playlist.addEntry(entry);
		return this;
	}
}

export class AudioTractor extends Tractor {
	constructor() {
		super();
		this.main_playlist = new AudioPlaylist();
		this.secondary_playlist = new AudioPlaylist();
	}

	toXML() {
		return [
			this.main_playlist.toXML(),
			this.secondary_playlist.toXML(),
			/* HTML */ ` <tractor id="tractor${this.index}" in="00:00:00.000">
				<property name="kdenlive:audio_track">1</property>
				<property name="kdenlive:trackheight">67</property>
				<property name="kdenlive:timeline_active">1</property>
				<property name="kdenlive:collapsed">0</property>
				<property name="kdenlive:thumbs_format" />
				<property name="kdenlive:audio_rec" />
				<track
					hide="video"
					producer="playlist${this.main_playlist.index}"
				/>
				<track
					hide="video"
					producer="playlist${this.secondary_playlist.index}"
				/>
			</tractor>`,
		].join("\n");
	}
}

export class VideoTractor extends Tractor {
	constructor() {
		super();
		this.main_playlist = new VideoPlaylist();
		this.secondary_playlist = new VideoPlaylist();
	}

	toXML() {
		return [
			this.main_playlist.toXML(),
			this.secondary_playlist.toXML(),
			/* HTML */ ` <tractor id="tractor${this.index}" in="00:00:00.000">
				<property name="kdenlive:trackheight">67</property>
				<property name="kdenlive:timeline_active">1</property>
				<track producer="playlist${this.main_playlist.index}" />
				<track producer="playlist${this.secondary_playlist.index}" />
			</tractor>`,
		].join("\n");
	}
}