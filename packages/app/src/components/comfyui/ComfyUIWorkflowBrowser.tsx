'use client'

import { useCallback, useEffect, useState } from 'react'
import { ClapWorkflowCategory } from '@aitube/clap'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MdSearch, MdRefresh, MdCheck } from 'react-icons/md'

export type ComfyUIWorkflowTemplate = {
  id: string
  name: string
  description: string
  author: string
  thumbnailUrl: string
  category: ClapWorkflowCategory
  tags: string[]
  workflowData: string
}

/**
 * Curated list of community ComfyUI workflows organized by category.
 * These are well-known workflows from the community that are known to work well.
 */
const CURATED_WORKFLOWS: ComfyUIWorkflowTemplate[] = [
  // IMAGE workflows
  {
    id: 'sdxl-flash-basic',
    name: 'SDXL Flash - Fast Image Generation',
    description: 'Fast high-quality image generation using SDXL Flash checkpoint with KSampler.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    tags: ['sdxl', 'fast', 'image', 'text-to-image'],
    workflowData: JSON.stringify({
      "3": { "inputs": { "seed": 156680208700286, "steps": 10, "cfg": 2.5, "sampler_name": "dpmpp_2m_sde", "scheduler": "karras", "denoise": 1, "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } },
      "4": { "inputs": { "ckpt_name": "SDXL-Flash.safetensors" }, "class_type": "CheckpointLoaderSimple", "_meta": { "title": "Load Checkpoint" } },
      "5": { "inputs": { "width": 1024, "height": 1024, "batch_size": 1 }, "class_type": "EmptyLatentImage", "_meta": { "title": "Empty Latent Image" } },
      "6": { "inputs": { "text": "beautiful scenery nature glass bottle landscape", "clip": ["4", 1] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Prompt)" } },
      "7": { "inputs": { "text": "text, watermark", "clip": ["4", 1] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Prompt)" } },
      "8": { "inputs": { "samples": ["3", 0], "vae": ["4", 2] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
      "9": { "inputs": { "filename_prefix": "ComfyUI", "images": ["8", 0] }, "class_type": "SaveImage", "_meta": { "title": "Save Image" } }
    }),
  },
  {
    id: 'sd15-basic',
    name: 'SD 1.5 - Basic Text to Image',
    description: 'Classic Stable Diffusion 1.5 text-to-image workflow. Good balance of speed and quality.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    tags: ['sd1.5', 'basic', 'image', 'text-to-image'],
    workflowData: JSON.stringify({
      "3": { "inputs": { "seed": 8566257, "steps": 20, "cfg": 8, "sampler_name": "euler", "scheduler": "normal", "denoise": 1, "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } },
      "4": { "inputs": { "ckpt_name": "v1-5-pruned-emaonly.ckpt" }, "class_type": "CheckpointLoaderSimple", "_meta": { "title": "Load Checkpoint" } },
      "5": { "inputs": { "width": 512, "height": 512, "batch_size": 1 }, "class_type": "EmptyLatentImage", "_meta": { "title": "Empty Latent Image" } },
      "6": { "inputs": { "text": "beautiful scenery nature glass bottle landscape", "clip": ["4", 1] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Prompt)" } },
      "7": { "inputs": { "text": "text, watermark, ugly", "clip": ["4", 1] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Negative)" } },
      "8": { "inputs": { "samples": ["3", 0], "vae": ["4", 2] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
      "9": { "inputs": { "filename_prefix": "ComfyUI", "images": ["8", 0] }, "class_type": "SaveImage", "_meta": { "title": "Save Image" } }
    }),
  },
  // VIDEO workflows
  {
    id: 'svd-img2vid',
    name: 'SVD Image to Video',
    description: 'Stable Video Diffusion img2vid workflow. Converts a still image to a short video clip.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    tags: ['svd', 'video', 'image-to-video', 'animation'],
    workflowData: JSON.stringify({
      "3": { "inputs": { "seed": 524650296754258, "steps": 20, "cfg": 2.5, "sampler_name": "euler", "scheduler": "karras", "denoise": 1, "model": ["14", 0], "positive": ["12", 0], "negative": ["12", 1], "latent_image": ["12", 2] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } },
      "8": { "inputs": { "samples": ["3", 0], "vae": ["15", 2] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
      "12": { "inputs": { "width": 1024, "height": 576, "video_frames": 14, "motion_bucket_id": 127, "fps": 6, "augmentation_level": 0, "clip_vision": ["15", 1], "init_image": ["24", 0], "vae": ["15", 2] }, "class_type": "SVD_img2vid_Conditioning", "_meta": { "title": "SVD_img2vid_Conditioning" } },
      "14": { "inputs": { "ckpt_name": "svd_xt.safetensors" }, "class_type": "ImageOnlyCheckpointLoader", "_meta": { "title": "Image Only Checkpoint Loader" } },
      "15": { "inputs": { "ckpt_name": "svd_xt.safetensors" }, "class_type": "ImageOnlyCheckpointLoader", "_meta": { "title": "Image Only Checkpoint Loader" } },
      "24": { "inputs": { "image": "@clapper/image" }, "class_type": "LoadImageFromBase64", "_meta": { "title": "Load Image From Base64" } },
      "25": { "inputs": { "frame_rate": 6, "loop_count": 0, "filename_prefix": "ComfyUI", "format": "video/h264-mp4", "images": ["8", 0] }, "class_type": "VHS_VideoCombine", "_meta": { "title": "Video Combine" } }
    }),
  },
  // SOUND workflows
  {
    id: 'audiogen-basic',
    name: 'AudioGen - Sound Effect Generation',
    description: 'Generate sound effects from text descriptions using AudioGen/AudioLDM models.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.SOUND_GENERATION,
    tags: ['audio', 'sound', 'sfx', 'text-to-audio'],
    workflowData: JSON.stringify({
      "1": { "inputs": { "text": "birds chirping in a forest with wind", "model_name": "audioldm2-large" }, "class_type": "AudioLDM2TextPrompt", "_meta": { "title": "Audio Prompt" } },
      "2": { "inputs": { "seed": 42, "steps": 50, "cfg": 3.5, "audio_length_secs": 5, "prompt": ["1", 0] }, "class_type": "AudioLDM2Sampler", "_meta": { "title": "Audio Sampler" } },
      "3": { "inputs": { "filename_prefix": "ComfyUI_audio", "audio": ["2", 0] }, "class_type": "SaveAudio", "_meta": { "title": "Save Audio" } }
    }),
  },
  // MUSIC workflows
  {
    id: 'musicgen-basic',
    name: 'MusicGen - Music Generation',
    description: 'Generate music from text descriptions using MusicGen model.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    tags: ['music', 'audio', 'text-to-music', 'musicgen'],
    workflowData: JSON.stringify({
      "1": { "inputs": { "text": "epic orchestral cinematic music", "model_name": "musicgen-medium" }, "class_type": "MusicGenPrompt", "_meta": { "title": "Music Prompt" } },
      "2": { "inputs": { "seed": 42, "steps": 50, "cfg": 3.5, "duration_secs": 10, "prompt": ["1", 0] }, "class_type": "MusicGenSampler", "_meta": { "title": "Music Sampler" } },
      "3": { "inputs": { "filename_prefix": "ComfyUI_music", "audio": ["2", 0] }, "class_type": "SaveAudio", "_meta": { "title": "Save Audio" } }
    }),
  },
  // VOICE workflows
  {
    id: 'tts-basic',
    name: 'TTS - Text to Speech',
    description: 'Generate speech/voice from text using a TTS workflow.',
    author: 'Community',
    thumbnailUrl: '',
    category: ClapWorkflowCategory.VOICE_GENERATION,
    tags: ['voice', 'tts', 'speech', 'text-to-speech'],
    workflowData: JSON.stringify({
      "1": { "inputs": { "text": "Hello, welcome to Clapper.", "speaker": "default", "language": "en" }, "class_type": "TTSGenerate", "_meta": { "title": "TTS Generate" } },
      "2": { "inputs": { "filename_prefix": "ComfyUI_voice", "audio": ["1", 0] }, "class_type": "SaveAudio", "_meta": { "title": "Save Audio" } }
    }),
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'All',
  [ClapWorkflowCategory.IMAGE_GENERATION]: 'Image',
  [ClapWorkflowCategory.VIDEO_GENERATION]: 'Video',
  [ClapWorkflowCategory.VOICE_GENERATION]: 'Voice',
  [ClapWorkflowCategory.SOUND_GENERATION]: 'Sound',
  [ClapWorkflowCategory.MUSIC_GENERATION]: 'Music',
}

type WorkflowBrowserProps = {
  open: boolean
  onClose: () => void
  onSelectWorkflow: (workflow: ComfyUIWorkflowTemplate) => void
  filterCategory?: ClapWorkflowCategory
}

export function ComfyUIWorkflowBrowser({
  open,
  onClose,
  onSelectWorkflow,
  filterCategory,
}: WorkflowBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    filterCategory || 'ALL'
  )
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<ComfyUIWorkflowTemplate | null>(null)

  const filteredWorkflows = CURATED_WORKFLOWS.filter((wf) => {
    const matchesCategory =
      selectedCategory === 'ALL' || wf.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesCategory && matchesSearch
  })

  const handleApply = useCallback(() => {
    if (selectedWorkflow) {
      onSelectWorkflow(selectedWorkflow)
      onClose()
    }
  }, [selectedWorkflow, onSelectWorkflow, onClose])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>ComfyUI Workflow Browser</DialogTitle>
          <p className="text-sm text-neutral-400">
            Browse curated community workflows. Select one and click Apply to
            use it.
          </p>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-neutral-200 focus:outline-none focus:border-neutral-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 flex-wrap">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'text-xs',
                selectedCategory === key
                  ? 'bg-neutral-600 text-white'
                  : 'bg-transparent text-neutral-400 border-neutral-700'
              )}
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Workflow Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {filteredWorkflows.map((wf) => (
              <div
                key={wf.id}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer transition-all',
                  selectedWorkflow?.id === wf.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-500'
                )}
                onClick={() => setSelectedWorkflow(wf)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-neutral-200">
                    {wf.name}
                  </h3>
                  {selectedWorkflow?.id === wf.id && (
                    <MdCheck className="text-blue-400 text-lg flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 mb-2 line-clamp-2">
                  {wf.description}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {wf.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 bg-neutral-700 text-neutral-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-neutral-500">
                    by {wf.author}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-neutral-700/50 text-neutral-400 rounded">
                    {CATEGORY_LABELS[wf.category] || wf.category}
                  </span>
                </div>
              </div>
            ))}

            {filteredWorkflows.length === 0 && (
              <div className="col-span-2 py-12 text-center text-neutral-500">
                No workflows found matching your criteria.
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-700">
          <p className="text-xs text-neutral-500">
            {filteredWorkflows.length} workflow
            {filteredWorkflows.length !== 1 ? 's' : ''} available
            {selectedWorkflow && (
              <span className="text-neutral-300">
                {' '}
                &middot; Selected: {selectedWorkflow.name}
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-neutral-700"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs"
              disabled={!selectedWorkflow}
              onClick={handleApply}
            >
              Apply Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
