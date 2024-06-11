import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Define a map from media type to file extension
const EXTENSIONS: { [type: string]: string } = {
  'audio/x-wav': 'wav',
  'audio/wav': 'wav',
  'audio/mp3': 'mp3',
  'audio/mpeg': 'mp3',
  'audio/webm': 'webm',
  // add more if needed
};

export async function convertAudioToMp3(dataUri: string): Promise<string> {
  const match = dataUri.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error('Invalid data URI');

  const mediaType = match[1];
  const base64Audio = match[2];

  const format = EXTENSIONS[mediaType];
  if (!format) throw new Error('Unsupported media type: ' + mediaType);

  if (format === 'mp3') return dataUri;  // If it's already a mp3, then do nothing

  const randomName = crypto.randomBytes(15).toString('hex');
  const inputPath = path.join(__dirname, `${randomName}.${format}`);
  const outputPath = path.join(__dirname, `${randomName}.mp3`);

  // Decode base64 and write to an audio file
  const audioBuffer = Buffer.from(base64Audio, 'base64');
  await fs.promises.writeFile(inputPath, audioBuffer);

  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on('end', async () => {
        const mp3File = await fs.promises.readFile(outputPath);
        await fs.promises.unlink(inputPath);
        await fs.promises.unlink(outputPath);
        resolve('data:audio/mp3;base64,' + mp3File.toString('base64'));
      })
      .on('error', async (err) => {
        await fs.promises.unlink(inputPath);
        reject(err);
      }).run();
  });
}