import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import fetch from 'node-fetch'

export interface M3U8Segment {
  duration: number
  uri: string
}

export interface HLSDownloadOptions {
  bearerToken?: string
  verbose?: boolean
}

export class HLSDownloader {
  private baseUrl: string
  private options: HLSDownloadOptions

  constructor(playlistUrl: string, options: HLSDownloadOptions = {}) {
    this.baseUrl = playlistUrl.substring(0, playlistUrl.lastIndexOf('/') + 1)
    this.options = options
  }

  /**
   * Parse M3U8 playlist content and extract segment information
   */
  private parseM3U8(content: string): M3U8Segment[] {
    const lines = content.split('\n').filter((line) => line.trim())
    const segments: M3U8Segment[] = []
    let currentDuration = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith('#EXTINF:')) {
        const match = line.match(/#EXTINF:([0-9.]+),/)
        if (match) {
          currentDuration = parseFloat(match[1])
        }
      } else if (line && !line.startsWith('#')) {
        segments.push({
          duration: currentDuration,
          uri: this.resolveUrl(line),
        })
      }
    }

    return segments
  }

  /**
   * Resolve relative URLs against base URL
   */
  private resolveUrl(uri: string): string {
    if (uri.startsWith('http')) {
      return uri
    }
    return this.baseUrl + uri
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(message)
    }
  }

  /**
   * Create fetch headers with optional authorization
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    if (this.options.bearerToken) {
      headers['Authorization'] = `Bearer ${this.options.bearerToken}`
    }

    return headers
  }

  /**
   * Download a single segment as Buffer
   */
  private async downloadSegment(url: string): Promise<Buffer> {
    const response = await fetch(url, {
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Failed to download segment: ${response.status}`)
    }
    return response.buffer()
  }

  /**
   * Download all segments and save to temporary file
   */
  private async downloadAllSegments(segments: M3U8Segment[]): Promise<string> {
    this.log(`Downloading ${segments.length} segments...`)

    const tempDir = tmpdir()
    const tempFile = join(tempDir, `hls_segments_${Date.now()}.ts`)

    // Download segments sequentially and append to file
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      this.log(
        `Downloading segment ${i + 1}/${segments.length}: ${segment.uri}`
      )

      const buffer = await this.downloadSegment(segment.uri)
      await fs.appendFile(tempFile, buffer)
    }

    return tempFile
  }

  /**
   * Convert video using native FFmpeg
   */
  private async convertWithFFmpeg(
    inputFile: string,
    outputFile: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i',
        inputFile,
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-movflags',
        'frag_keyframe+empty_moov',
        '-f',
        'mp4',
        '-y', // Overwrite output file
        outputFile,
      ])

      let stderr = ''

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString()
        // Extract progress if needed
        const progressMatch = stderr.match(/time=(\d+:\d+:\d+\.\d+)/)
        if (progressMatch && this.options.verbose) {
          console.log('FFmpeg progress:', progressMatch[1])
        }
      })

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`FFmpeg exited with code ${code}\nError: ${stderr}`))
        }
      })

      ffmpeg.on('error', (error) => {
        reject(new Error(`Failed to start FFmpeg: ${error.message}`))
      })
    })
  }

  /**
   * Download HLS playlist and convert to MP4
   */
  async downloadAsMP4(
    playlistUrl: string,
    outputPath?: string
  ): Promise<string> {
    let tempInputFile: string | null = null

    try {
      // Download playlist
      this.log('Downloading playlist...')
      const playlistResponse = await fetch(playlistUrl, {
        headers: this.getHeaders(),
      })
      if (!playlistResponse.ok) {
        throw new Error(
          `Failed to download playlist: ${playlistResponse.status}`
        )
      }

      const playlistContent = await playlistResponse.text()
      this.log('Playlist downloaded successfully')

      // Parse segments
      const segments = this.parseM3U8(playlistContent)
      this.log(`Found ${segments.length} segments`)

      // Download all segments to temp file
      tempInputFile = await this.downloadAllSegments(segments)
      this.log(`Downloaded segments to: ${tempInputFile}`)

      // Set output path
      const outputFile =
        outputPath || join(tmpdir(), `hls_output_${Date.now()}.mp4`)

      // Convert to MP4
      this.log('Converting to MP4...')
      await this.convertWithFFmpeg(tempInputFile, outputFile)
      this.log(`Conversion complete: ${outputFile}`)

      return outputFile
    } catch (error) {
      console.error('Error downloading and converting HLS video:', error)
      throw error
    } finally {
      // Clean up temp file
      if (tempInputFile) {
        try {
          await fs.unlink(tempInputFile)
        } catch (err) {
          if (this.options.verbose) {
            console.warn('Failed to clean up temp file:', err)
          }
        }
      }
    }
  }

  /**
   * Download HLS playlist and return as base64 MP4
   */
  async downloadAsMP4Base64(playlistUrl: string): Promise<string> {
    let outputFile: string | null = null

    try {
      outputFile = await this.downloadAsMP4(playlistUrl)
      const buffer = await fs.readFile(outputFile)
      return buffer.toString('base64')
    } finally {
      // Clean up output file
      if (outputFile) {
        try {
          await fs.unlink(outputFile)
        } catch (err) {
          if (this.options.verbose) {
            console.warn('Failed to clean up output file:', err)
          }
        }
      }
    }
  }

  /**
   * Get MP4 data URI for video
   */
  async getMP4DataUri(playlistUrl: string): Promise<string> {
    const base64 = await this.downloadAsMP4Base64(playlistUrl)
    return `data:video/mp4;base64,${base64}`
  }
}

// Usage functions
export async function downloadHLSAsMP4(
  playlistUrl: string,
  options?: HLSDownloadOptions
): Promise<string> {
  const downloader = new HLSDownloader(playlistUrl, options)
  return await downloader.getMP4DataUri(playlistUrl)
}

export async function downloadHLSAsMP4File(
  playlistUrl: string,
  outputPath?: string,
  options?: HLSDownloadOptions
): Promise<string> {
  const downloader = new HLSDownloader(playlistUrl, options)
  return await downloader.downloadAsMP4(playlistUrl, outputPath)
}

// Example usage:
/*
const playlistUrl = 'https://jbilcke-hf-fast-rendering-node-for-clapper.hf.space/gradio_api/stream/tk0bzns2jd/140088883108720/22/playlist.m3u8';

// Silent mode (default) - no console output except errors
const dataUri = await downloadHLSAsMP4(playlistUrl);

// Verbose mode - shows download progress and conversion steps
const options: HLSDownloadOptions = {
  bearerToken: 'your-auth-token-here',
  verbose: true
};

downloadHLSAsMP4(playlistUrl, options)
  .then(dataUri => {
    console.log('Authenticated video downloaded as data URI!');
    // Use the data URI in your application
  })
  .catch(error => {
    console.error('Failed to download and convert video:', error);
  });

// Silent mode with authentication
const silentOptions: HLSDownloadOptions = {
  bearerToken: 'your-auth-token-here',
  verbose: false // or omit this as false is default
};

downloadHLSAsMP4(playlistUrl, silentOptions)
  .then(dataUri => {
    // No progress logs, just the result
    console.log('Download completed silently');
  });

// If you need to save to a file instead, use downloadHLSAsMP4File
downloadHLSAsMP4File(playlistUrl, './output.mp4', options)
  .then(outputPath => {
    console.log('Video saved to file:', outputPath);
  })
  .catch(error => {
    console.error('Failed to save video file:', error);
  });
*/
