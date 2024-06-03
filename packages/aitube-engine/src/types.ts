
export type StoryboardRenderer = (request: {
  prompt: string;
  identityImage?: string;
  width?: number;
  height?: number;
  seed?: number;
  turbo?: boolean;
}) => Promise<string>


export type VideoRenderer = (request: {
  imageInputBase64?: string;
  seed?: number;
  width?: number;
  height?: number;
  nbFrames?: number;
  nbFPS?: number;
  nbSteps?: number;
  debug?: boolean;
}) => Promise<string>

export type VideoFirstFrameExtractor = (params: {
  inputVideo?: string;
  outputFormat?: "jpeg" | "png" | "webp";
}) => Promise<string>
