# Native ComfyUI workflows in Clapper

Configure the ComfyUI server URL in Provider settings. Use `http://localhost:8188` when ComfyUI and the Clapper server run on the same machine. In a container or remote deployment, `localhost` refers to the Clapper server, not the browser's computer. An HTTP(S) reverse-proxy path such as `https://example.com/comfy/` is supported. Enter optional HTTP Basic credentials in their dedicated fields.

1. Obtain a community workflow (for example from OpenArt), open it in ComfyUI, install its required custom nodes and models, and verify it runs there.
2. Export **API-format JSON**, not the canvas/UI JSON. In the corresponding Clapper Image, Video, Voice, Sound or Music settings, import/drop the file or paste the JSON. Imports are limited to 2 MB and 1,000 nodes.
3. Expand the graph preview to inspect the nodes and connections. Set the prompt, negative prompt, dimensions, seed, source image and output mappings as appropriate. Unset mappings leave the workflow's literal values intact. Choose a Save output node that returns the requested media.
4. Choose the **Custom … Workflow** from the corresponding generation workflow picker. Later edits to the selected custom workflow update its saved settings. Changing local ComfyUI settings does not replace an unrelated selected audio provider.
5. Generate a clip using that category. Image and video use the image prompt, dialogue uses the voice prompt, sound uses the audio prompt, and music uses the music prompt.

Stock `LoadImage` inputs mapped for video receive an uploaded source image when the source is a base64 image data URI. Custom base64 input nodes receive the raw payload. Existing server-side image filenames can remain as literal node settings. Remote source-image URLs are not automatically downloaded by the upload adapter.

The adapter queues `/prompt`, waits on `/history/{prompt_id}`, and downloads the selected node's media via `/view`. HTTP Basic authentication also applies to upload, history and media requests. It supports standard `images`, `videos`, `gifs` and `audio` file descriptors. Video must return `video/*` or GIF; a static PNG or audio file cannot silently complete a video request. Custom nodes that only return arbitrary tensors, text or proprietary response fields need their own output adapter.

Errors are reported for malformed graphs, missing nodes, queue rejection, execution failure, missing output, authentication failure and oversized files. One run has a ten-minute timeout and a 64 MiB media limit. A timeout does **not** interrupt the entire ComfyUI server; a job may continue there, so inspect its queue before retrying. Credentials, prompts and generated media are not logged by this adapter. Redirects are refused to avoid sending credentials to an unexpected destination.

## Verification

From the monorepo root, install dependencies with Bun. If using a modern Bun release, `bun install --ignore-scripts --linker=hoisted` matches this older repository's dependency layout. Then build the workspace packages using its existing build scripts.

From `packages/app`, run:

```sh
../../node_modules/.bin/vitest run --config vitest.comfy.config.mts
```

The suite includes graph validation, all five category mappings, legacy/new audio settings, selected-workflow updates, file import, preview, credential propagation, polling, image upload, selected output handling, execution failures, timeouts and a loopback HTTP protocol fixture. The protocol fixture does not run a GPU model. For final deployment acceptance, run one real image, video, dialogue, sound and music workflow against the intended ComfyUI installation and confirm the generated asset in Clapper's timeline.
