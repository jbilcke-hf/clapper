"use client"

import { ClapAssetSource, ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"
import { TimelineStore, useTimeline } from "@aitube/timeline"
import { parseScriptToClap } from "@aitube/broadway"
import { create } from "zustand"
import { mltToXml } from "mlt-xml"
import * as fflate from 'fflate'

import { getDefaultIOState } from "./getDefaultIOState"
import { IOStore } from "./types"

import { blobToBase64DataUri } from "@/lib/utils/blobToBase64DataUri"
import { parseFileIntoSegments } from "./parseFileIntoSegments"
import { useTasks } from "@/components/tasks/useTasks"
import { Task, TaskCategory, TaskVisibility } from "@/components/tasks/types"
import { parseFileName } from "./parseFileName"
import { useRenderer } from "../renderer"
import { base64DataUriToUint8Array } from "@/lib/utils/base64DataUriToUint8Array"
// import { Entry, Project } from "@/lib/kdenlive"
// import { formatDuration } from "@/lib/utils/formatDuration"


export const useIO = create<IOStore>((set, get) => ({
  ...getDefaultIOState(),

  clear: () => {
    const renderer = useRenderer.getState()
    const timeline: TimelineStore = useTimeline.getState()
    
    // reset various things
    renderer.clear()
    timeline.clear()
  },
  openFiles: async (files: File[]) => {
    const { openClapBlob, openScreenplay } = get()
    const timeline: TimelineStore = useTimeline.getState()
    const { segments, addSegments } = timeline

    if (Array.isArray(files)) {
      console.log("user tried to drop some files:", files)

      // for now let's simplify things, and only import the first file
      const file: File | undefined = files.at(0)
      if (!file) { return }

      const input = `${file.name || ""}`
      const { fileName, projectName, extension } = parseFileName(input)

      const fileType = `${file.type || ""}`

      console.log(`file type: ${fileType}`)

      const isClapFile = extension === "clap"

      if (isClapFile) {
        await openClapBlob(projectName, fileName, file)
        return
      }

      const isTextFile = fileType.startsWith("text/")
      if (isTextFile) {
        await openScreenplay(projectName, fileName, file)
        return
      }

      const isAudioFile = fileType.startsWith("audio/")
   
      // TODO: detect the type of file, and do a different treatment based on this
      // screenplay files: -> analyze (if there is existing data, show a modal asking to save or not)
      // mp3 file: -> 
      if (isAudioFile) {
        const newSegments = await parseFileIntoSegments({ file })

        console.log("calling  timeline.addSegments with:", newSegments)
        await timeline.addSegments({
          segments: newSegments
        })
        return
      }

      const isVideoFile = fileType.startsWith("video/")
  
    }
  },
  openScreenplay: async (projectName: string, fileName: string, fileContent: string | Blob): Promise<void> => {
    const plainText =
      typeof fileContent === "string"
      ? fileContent :
      (await new Response(fileContent).text())
    
    const timeline: TimelineStore = useTimeline.getState()
    const task = useTasks.getState().add({
      category: TaskCategory.IMPORT,
      visibility: TaskVisibility.BLOCKER,
      initialMessage:  `Loading ${fileName}`,
      successMessage: `Successfully loaded the screenplay!`,
      value: 0,
    })
    task.setProgress({
      message: "Analyzing screenplay..",
      value: 10
    })

    try {
      // this is the old way, based on a call to a separate API hosted on HF
      // obviously this wasn't very practical and easy to scale, so I'm dropping it
      //
      // const res = await fetch("https://jbilcke-hf-broadway-api.hf.space", {
      //   method: "POST",
      //   headers: { 'Content-Type': 'text/plain' },
      //   body: plainText,
      // })
      // const blob = await res.blob()
      // task.setProgress({
      //   message: "Loading scenes..",
      //   value: 50
      // })
      // const clap = await parseClap(blob)

      // new way: we analyze the screenplay on browser side
      const clap = await parseScriptToClap(plainText)
      clap.meta.title = `${projectName || ""}`

      task.setProgress({
        message: "Loading rendering engine..",
        value: 70
      })

      await timeline.setClap(clap)

      task.setProgress({
        message: "Nearly there..",
        value: 95
      })

      task.success()
    } catch (err) {
       console.error("failed to import the screenplay:", err)
      task.fail(`${err || "unknown screenplay import error"}`)
    } finally {

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
    const timeline: TimelineStore = useTimeline.getState()
    const { setClap } = timeline

    const { fileName, projectName } = parseFileName(`${url.split("/").pop() || url}`)
    
    const task = useTasks.getState().add({
      category: TaskCategory.IMPORT,
      visibility: TaskVisibility.BLOCKER,
      initialMessage:  `Loading ${fileName}`,
      successMessage: `Successfully downloaded the project!`,
      value: 0,
    })

    task.setProgress({
      message: "Downloading file..",
      value: 10
    })

    try {
      const res = await fetch(url)
      const blob = await res.blob()

      task.setProgress({
        message: "Loading scenes..",
        value: 30
      })

      const clap = await parseClap(blob)
      clap.meta.title = `${projectName}`

      task.setProgress({
        message: "Loading rendering engine..",
        value: 70
      })

      await setClap(clap)

      task.success()
    } catch (err) {
      task.fail(`${err || "unknown error"}`)
    }
  },
  openClapBlob: async (projectName: string, fileName: string, blob: Blob) => {
    const timeline: TimelineStore = useTimeline.getState()
    const { setClap } = timeline

    const task = useTasks.getState().add({
      category: TaskCategory.IMPORT,
      visibility: TaskVisibility.BLOCKER,
      initialMessage:  `Loading ${fileName}`,
      successMessage: `Successfully loaded the project!`,
      value: 0,
    })
    try {

      task.setProgress({
        message: "Loading scenes..",
        value: 30
      })

      const clap = await parseClap(blob)
      clap.meta.title = `${projectName}`

      task.setProgress({
        message: "Loading rendering engine..",
        value: 70
      })

      await setClap(clap)

      task.success()
    } catch (err) {
      task.fail(`${err || "unknown error"}`)
    }
  },
  saveClap: async () => {
    const { saveAnyFile } = get()
    const { clap } = useTimeline.getState()

    if (!clap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    const tasks = useTasks.getState()
    
    const task = tasks.add({
      category: TaskCategory.EXPORT,
      visibility: TaskVisibility.BLOCKER,
      initialMessage: `Exporting project to OpenClap..`,
      successMessage: `Successfully exported the project!`
      // mode: "percentage", // default
      // min: 0, // default
      // max: 100 // default
    })
    
    // make sure we update the total duration
    for (const s of clap.segments) {
      if (s.endTimeInMs > clap.meta.durationInMs) {
        clap.meta.durationInMs = s.endTimeInMs
      }
    }

    // TODO: serializeClap should have a progress callback, so that we can
    // track the progression.
    //
    // also, I'm 100% aware that at some point we will just want to use the
    // desktop version of Clapper, so that we can write the gzip stream directly to the disk 
    const blob: Blob = await serializeClap(clap)
    saveAnyFile(blob, `my_project.clap`) // <-- TODO use the project filename

    task.success()
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

  saveZipFile: async () => {
    const { saveAnyFile } = get()
    console.log(`exporting project to ZIP..`)

    const task = useTasks.getState().add({
      category: TaskCategory.EXPORT,
      visibility: TaskVisibility.BLOCKER,
      initialMessage:  `Exporting project to ZIP..`,
      successMessage: `Successfully exported the project!`,
      value: 0,
    })

    const clap: ClapProject = useTimeline.getState().clap

    const segments: ClapSegment[] = useTimeline.getState().segments

    let files: fflate.AsyncZippable = {}

    files['screenplay.txt'] = fflate.strToU8(clap.meta.screenplay)
    
    files['meta.json'] = fflate.strToU8(JSON.stringify(clap.meta, null, 2))


    segments.forEach((segment, i) => {
      const directory = `${segment.category}`.toLowerCase()
      const prefix = `shot_${String(i).padStart(4, '0')}_`
      let mimetype = `${segment.assetFileFormat || "unknown/unknown"}`
      if (mimetype === "audio/mpeg") {
        mimetype = "audio/mp3"
      }
      const format = `${mimetype.split("/").pop() || "unknown"}`.toLowerCase()
      const filePath = `${directory}/${prefix}${segment.id}.${format}`
      let assetUrl = segment.assetUrl || ""
      let assetSourceType = segment.assetSourceType || ClapAssetSource.EMPTY

      // we extract the base64 files
      if (segment.assetUrl.startsWith("data:")) {
        files[filePath] = [
          // we don't compress assets since normally they already use
          // some form of compression (PNG, JPEG, MP3, MP4 etc..)
          base64DataUriToUint8Array(segment.assetUrl),
          { level: 0 }
        ]
        assetUrl = filePath
        assetSourceType = ClapAssetSource.PATH
      }

      // segment metadata
      files[`segments/${prefix}${segment.id}.json`] = fflate.strToU8(JSON.stringify({
        ...segment,
        assetUrl,
        assetSourceType
      }, null, 2))
    })


    fflate.zip(files, {
      // options
    },
    (error, zipFile) => {
      task.setProgress({
        message: "Saving to file..",
        value: 90
      })
      saveAnyFile(new Blob([zipFile]), "my_project.zip")
      task.success()
    })
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
    // const tracks: ClapTracks = useTimeline.getState().tracks

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


if (typeof window !== "undefined") {
  (window as any).useIO = useIO
}