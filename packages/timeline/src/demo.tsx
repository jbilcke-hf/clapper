import React from 'react'
import { createRoot } from 'react-dom/client'
import './demo.css'

import { ClapTimeline, useTimeline } from '.'

const container = document.getElementById('root')
const root = createRoot(container!)

const segment = {
  id: '105246fd-7be3-4dfa-9596-01068ad858e9',
  track: 1,
  startTimeInMs: 0,
  endTimeInMs: 500 * 4,
  category: 'VIDEO',
  entityId: '',
  workflowId: '',
  sceneId: '7d12441e-e002-4882-80e0-37c09fde5dc9',
  startTimeInLines: 0,
  endTimeInLines: 0,
  prompt: 'movie',
  label: 'movie',
  outputType: 'VIDEO',
  renderId: '',
  status: 'TO_GENERATE',
  assetUrl: '',
  assetDurationInMs: 1000,
  assetSourceType: 'EMPTY',
  assetFileFormat: '',
  revision: 0,
  createdAt: '2024-08-15T21:08:38.438Z',
  createdBy: 'auto',
  editedBy: 'auto',
  outputGain: 0,
  seed: 1523799474,
  visibility: 'VISIBLE',
  textures: {},
  isSelected: false,
  isHovered: false,
  isActive: false,
  isPlaying: false,
  isHoveredOnBody: false,
  isHoveredOnLeftHandle: false,
  isHoveredOnRightHandle: false,
  isGrabbedOnBody: false,
  isGrabbedOnLeftHandle: false,
  isGrabbedOnRightHandle: false,
  editionStatus: 'EDITABLE',
}

useTimeline.setState({
  totalDurationInMs: 2000,
  theme: {
    topBarTimeScale: {
      backgroundColor: '#7d7c78',
      textColor: '#ffffff',
      lineColor: '#E6E6E6',
    },
    leftBarTrackScale: {
      backgroundColor: '#7d7c78',
      textColor: '#ffffff',
      lineColor: '#B3B3B3',
    },
    grid: {
      backgroundColor: '#292524',
    },
    cell: {
      categoryColors: {
        SPLAT: {
          hue: 347,
          saturation: 30,
          lightness: 78.6,
        },
        MESH: {
          hue: 32,
          saturation: 30,
          lightness: 78.6,
        },
        DEPTH: {
          hue: 242,
          saturation: 30,
          lightness: 78.6,
        },
        EVENT: {
          hue: 270,
          saturation: 30,
          lightness: 78.6,
        },
        EFFECT: {
          hue: 270,
          saturation: 30,
          lightness: 78.6,
        },
        INTERFACE: {
          hue: 216,
          saturation: 30,
          lightness: 78.6,
        },
        PHENOMENON: {
          hue: 270,
          saturation: 30,
          lightness: 78.6,
        },
        VIDEO: {
          hue: 70,
          saturation: 30,
          lightness: 78.6,
        },
        STORYBOARD: {
          hue: 70,
          saturation: 30,
          lightness: 78.6,
        },
        TRANSITION: {
          hue: 55,
          saturation: 30,
          lightness: 78.6,
        },
        CHARACTER: {
          hue: 285.8,
          saturation: 30,
          lightness: 78.6,
        },
        LOCATION: {
          hue: 80.9,
          saturation: 30,
          lightness: 78.6,
        },
        TIME: {
          hue: 250,
          saturation: 30,
          lightness: 78.6,
        },
        ERA: {
          hue: 250,
          saturation: 30,
          lightness: 78.6,
        },
        LIGHTING: {
          hue: 50,
          saturation: 30,
          lightness: 78.6,
        },
        WEATHER: {
          hue: 197.2,
          saturation: 30,
          lightness: 78.6,
        },
        ACTION: {
          hue: 3,
          saturation: 30,
          lightness: 78.6,
        },
        MUSIC: {
          hue: 100,
          saturation: 30,
          lightness: 78.6,
        },
        SOUND: {
          hue: 60,
          saturation: 30,
          lightness: 78.6,
        },
        DIALOGUE: {
          hue: 23,
          saturation: 30,
          lightness: 78.6,
        },
        STYLE: {
          hue: 285,
          saturation: 30,
          lightness: 78.6,
        },
        CAMERA: {
          hue: 10,
          saturation: 30,
          lightness: 78.6,
        },
        GENERIC: {
          hue: 200,
          saturation: 30,
          lightness: 78.6,
        },
      },
      waveform: {
        lineSpacing: 2,
        gradientStart: 1,
        gradientEnd: 0.6,
      },
    },
    playbackCursor: {
      lineColor: '#FACC15',
    },
  },
  loadedSegments: [segment],
  tracks: [
    {
      id: 0,
      name: '(empty)',
      isPreview: false,
      height: 48,
      hue: 0,
      occupied: false,
      visible: true,
      contentHeight: 48,
    },
    {
      id: 1,
      name: 'VIDEO',
      isPreview: true,
      height: 100,
      hue: 0,
      occupied: true,
      visible: true,
      contentHeight: 100,
    },
  ],
  segments: [segment],
  visibleSegments: [segment],
})

root.render(
  <React.StrictMode>
    <ClapTimeline className="w-[1000px] h-[400px]" />
  </React.StrictMode>
)
