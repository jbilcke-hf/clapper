"use client"

import { ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode, ClapSegmentStatus, filterSegments, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"
import { Track, Tracks, useTimeline } from "@aitube/timeline"
import { create } from "zustand"
import { mltToXml } from "mlt-xml"

import { getDefaultIOState } from "./getDefaultIOState"
import { IOStore } from "./types"

import { blobToBase64DataUri } from "@/lib/utils/blobToBase64DataUri"
import { parseFileIntoSegments } from "./parseFileIntoSegments"
// import { Entry, Project } from "@/lib/kdenlive"
// import { formatDuration } from "@/lib/utils/formatDuration"


export const useIO = create<IOStore>((set, get) => ({
  ...getDefaultIOState(),

  openFiles: async (files: File[]) => {
    const segments: ClapSegment[] = useTimeline.getState().segments
    
    console.log("File", File)
    if (Array.isArray(File)) {
      console.log("user tried to drop some files:", File)

      // for now let's simplify things, and only import the first file
      const file = File.at(0)
      if (!file) { return }

      console.log(`file type: ${file.type}`)

      const isClapFile = file.name.endsWith(".clap")
      const isAudioFile = file.type.startsWith("audio/")
      const isVideoFile = file.type.startsWith("video/")
      const isTextFile = file.type.startsWith("text/")

      // TODO: detect the type of file, and do a different treatment based on this
      // screenplay files: -> analyze (if there is existing data, show a modal asking to save or not)
      // mp3 file: -> 
      if (isAudioFile) {
        const newSegments = await parseFileIntoSegments({
          file,
          segments,
        })
      }

      // for the moment let's not care of the coordinates at all
      /*
      parseFilesIntoSegments({
        files,
        columnIndex,
        rowIndex,
        segments,
        segment
      })
      */
    }
  },
  saveAnyFile: (blob: Blob, fileName: string) => {
    // Create an object URL for the compressed clap blob
    // object urls are short-lived urls, with the benefit of having a short id too

    const objectUrl = URL.createObjectURL(blob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    anchor.download = fileName

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
  openClapUrl: async (url: string) => {
    const { setClap } = useTimeline.getState()
    const res = await fetch(url)
    const blob = await res.blob()
    const clap = await parseClap(blob)
    await setClap(clap)
  },
  saveClap: async () => {
    const { saveAnyFile } = get()
    const { clap } = useTimeline.getState()

    if (!clap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    // make sure we update the total duration
    for (const s of clap.segments) {
      if (s.endTimeInMs > clap.meta.durationInMs) {
        clap.meta.durationInMs = s.endTimeInMs
      }
    }

    const blob: Blob = await serializeClap(clap)
    saveAnyFile(blob,  `my_project.clap`)
  },

  saveVideoFile: async () => {
    const { saveAnyFile } = get()
    console.log(`rendering project using the free community server..`)

    const clap: ClapProject = useTimeline.getState().clap

    const segments: ClapSegment[] = useTimeline.getState().segments

    // note: I didn't put it inside the clapper's own API,
    // because this is something a bit fragile
    // (it uses ffmpeg and puppeteer, sometimes it crashes etc)
    const result = await fetch(
      // TODO: put this into a variable
      // also rename this to so cool-sounding module
      `https://jbilcke-hf-ai-tube-clap-exporter.hf.space?f=mp4`,
      {
        method: "POST",
        body: await serializeClap(clap)
      }
    )

    const videoBlob = await result.blob()

    const videoDataUrl = await blobToBase64DataUri(videoBlob)

    const alreadyAnEmbeddedFinalVideo = segments.filter(s =>
      s.category === ClapSegmentCategory.VIDEO &&
      s.status === ClapSegmentStatus.COMPLETED &&
      s.startTimeInMs === 0 &&
      s.endTimeInMs === clap.meta.durationInMs &&
      s.assetUrl).at(0)

   // inject the final mp4 video file into the .clap
   if (alreadyAnEmbeddedFinalVideo) {
      console.log(`editing the clap to update the final video`)
      alreadyAnEmbeddedFinalVideo.assetUrl = videoDataUrl
    } else {
      console.log(`editing the clap to add a new final video`)
      clap.segments.push(newSegment({
        category: ClapSegmentCategory.VIDEO,
        status: ClapSegmentStatus.COMPLETED,
        startTimeInMs: 0,
        endTimeInMs: clap.meta.durationInMs,
        assetUrl: videoDataUrl,
        assetDurationInMs: clap.meta.durationInMs,
        assetSourceType: getClapAssetSourceType(videoDataUrl),
        outputGain: 1.0,
      }))
    }

    console.log(`The free community server responded: ${result.status} ${result.statusText}`)
    
    saveAnyFile(videoBlob, "my_project.mp4")

  },

  openMLT: async (file: File) => {

  },
  saveMLT: async () => {
    const { clap } = useTimeline.getState()
    
    const xml = mltToXml({
      title: 'watermarkOnVideo',
      elements: [
        {
          name: 'producer',
          attributes: {
            id: 'video',
            in: '0',
            out: '1000',
            resource: 'clip.mpeg',
          },
        },
        {
          name: 'producer',
          attributes: {
            id: 'watermark',
            in: '0',
            out: '1000',
            resource: 'watermark.png',
            mlt_service: 'qimage',
            length: '1000',
          },
        },
        {
          name: 'tractor',
          attributes: {
            id: 'tractor0',
          },
          elements: [
            {
              name: 'multitrack',
              attributes: {
                id: 'multitrack0',
              },
              elements: [
                {
                  name: 'playlist',
                  attributes: {
                    id: 'video_track',
                    in: '0',
                    out: '1000',
                  },
                  elements: [
                    {
                      name: 'entry',
                      attributes: {
                        producer: 'video',
                        in: '0',
                        out: '1000',
                      },
                    },
                  ],
                },
                {
                  name: 'playlist',
                  attributes: {
                    id: 'watermark_track',
                    in: '0',
                    out: '1000',
                  },
                  elements: [
                    {
                      name: 'entry',
                      attributes: {
                        producer: 'watermark',
                        in: '0',
                        out: '1000',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'transition',
              attributes: {
                id: 'transition0',
                a_track: 0,
                b_track: 1,
                geometry: '85%/5%:10%x10%',
                factory: 'loader',
                progressive: 1,
                mlt_service: 'composite',
                fill: 1,
                sliced_composite: 1,
              },
            },
          ],
        },
      ],
    })

    console.log(`MLT output: `, xml)
  },

  openKdenline: async (file: File) => {

  },

  saveKdenline: async () => {
    const { saveAnyFile } = get()
    const clap: ClapProject = useTimeline.getState().clap
    // const tracks: Tracks = useTimeline.getState().tracks

    throw new Error(`cannot run in a browser, unfortunately`)

    /*

    // hum.. we should add FPS to the ClapProject metadata
    const fps = 30 // clap.meta

    // for documentation, look at the example test file in:
    // https://www.npmjs.com/package/kdenlive?activeTab=code
    const project = new Project(fps)

    const cameraSegments = clap.segments.filter(s => s.category === ClapSegmentCategory.CAMERA)
 
    const segmentsWithNonEmptyAssets = clap.segments.filter(s => s.assetUrl)

    // const videoSegments = clap.segments.filter(s => s.category === ClapSegmentCategory.VIDEO && s.assetUrl)
    const videoTractor = project.addVideoTractor()

    // const soundSegments = clap.segments.filter(s => s.category === ClapSegmentCategory.SOUND && s.assetUrl)
    const soundTractor = project.addAudioTractor()

    // const voiceSegments = clap.segments.filter(s => s.category === ClapSegmentCategory.DIALOGUE && s.assetUrl)
    const voiceTractor = project.addAudioTractor()

    // const musicSegments = clap.segments.filter(s => s.category === ClapSegmentCategory.MUSIC && s.assetUrl)
    const musicTractor = project.addAudioTractor()

    for (const shot of cameraSegments) {
      const videoSegments = filterSegments(
        ClapSegmentFilteringMode.ANY,
        shot,
        segmentsWithNonEmptyAssets,
        ClapSegmentCategory.VIDEO
      )
      const videoSegment = videoSegments.at(0)
      if (videoSegment) { continue }

      const producer = project.addProducer(`${videoSegment.id}.mp4`)
			
      const entry = new Entry(
        producer,
        formatDuration(shot.startTimeInMs),
        formatDuration(shot.endTimeInMs)
      )
			videoTractor.addEntry(entry)
			// audio_track.addEntry(entry)
    }

    const xml = await project.toXML()
    const blob = new Blob([xml], { type: "text/xml" })
    saveAnyFile(blob, `my_project.kdenlive`)

    */
  },

  openOpenTimelineIO: async (file: File) => {
    
  },

  saveOpenTimelineIO: async () => {

  }
}))