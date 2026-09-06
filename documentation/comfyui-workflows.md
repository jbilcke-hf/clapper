# ComfyUI Workflows

Clapper can run ComfyUI API workflows against either a local ComfyUI server or a hosted/cloud ComfyUI endpoint.

## Provider Settings

Open the provider settings and configure:

- **ComfyUI API URL**: local example `http://localhost:8188`, or a hosted endpoint URL.
- **ComfyUI Client ID**: any stable client id, defaults to `clapper`.
- **ComfyUI bearer token**: optional, for hosted endpoints that expect `Authorization: Bearer ...`.
- **ComfyUI HTTP Auth login/password**: optional, for endpoints protected by Basic Auth.
- **Comfy.icu API key**: enables running selected `comfyicu://...` API workflows through ComfyICU.
- **ComfyDeploy API key and deployment ID**: enables running exposed ComfyDeploy deployments.

Bearer auth takes precedence over Basic Auth when both are configured.

## Workflow Settings

For image and video generation, use the community workflow catalog, import a workflow JSON from a URL, or paste an API-format ComfyUI workflow JSON into the ComfyUI workflow fields under image/video settings. Clapper parses the graph, shows a live graph preview, finds editable node inputs, and lets you map Clapper-level inputs such as:

- `@clapper/prompt`
- `@clapper/negative/prompt`
- `@clapper/width`
- `@clapper/height`
- `@clapper/seed`
- `@clapper/image`
- `@clapper/output`

Voice, sound, and music workflows can also be registered as ComfyUI workflows. Select the corresponding ComfyUI workflow in the workflow picker for the segment type.

The workflow catalog is intentionally API-format JSON. GUI-exported ComfyUI workflows need to be exported or converted to API format before installation.

## Local Smoke Workflow

For a local ComfyUI server, the minimum settings are:

- Provider: `ComfyUI`
- Engine: `COMFYUI_WORKFLOW`
- ComfyUI API URL: `http://localhost:8188`
- ComfyUI Client ID: `clapper`
- Auth fields: leave empty unless the local server is protected

This API-format workflow is useful for a model-free local smoke test because it only uploads an input image and saves it back through ComfyUI:

```json
{
  "1": {
    "class_type": "LoadImage",
    "inputs": {
      "image": "@clapper/image"
    }
  },
  "2": {
    "class_type": "SaveImage",
    "inputs": {
      "images": ["1", 0],
      "filename_prefix": "clapper_smoke"
    }
  }
}
```

Set `@clapper/image` to the segment input image value and map `@clapper/output` to node `2`. A successful run returns a ComfyUI `images` output from node `2`, which Clapper fetches through `/view` and stores as an image data URI on the resolved segment.

Common output mappings are:

- `SaveImage.images` -> image segment output
- video output nodes returning `videos` or `gifs` -> video segment output
- audio output nodes returning `audio` or `audios` -> voice, sound, or music segment output
- generic output nodes returning `files` -> file-like asset fetched through the same `/view` path

## Runtime Behavior

When a segment is resolved with provider `ComfyUI` and engine `COMFYUI_WORKFLOW`, Clapper:

1. Loads the selected workflow JSON.
2. Applies saved workflow input values.
3. Injects the segment prompt, dimensions, seed, and optional input image.
4. Uploads data-URI image inputs to ComfyUI when the workflow expects an image filename.
5. Queues the workflow with `/prompt`.
6. Polls `/history/{prompt_id}` until outputs are available.
7. Prioritizes the asset from the mapped `@clapper/output` node, then falls back to other output nodes.
8. Fetches the returned image/video/gif/audio asset through `/view`.
9. Stores the result as a data URI on the resolved segment.

When a segment is resolved with provider `Comfy.icu` and engine `COMFYUI_WORKFLOW`, Clapper:

1. Loads the selected `comfyicu://...` workflow.
2. Injects Clapper prompt, seed, dimensions, and image values into the API-format prompt.
3. Queues the run with the ComfyICU workflow run API.
4. Polls the run status endpoint.
5. Downloads the returned output URL and stores it as a data URI.

When a segment is resolved with provider `ComfyDeploy` and engine `COMFYUI_WORKFLOW`, Clapper:

1. Uses the configured deployment ID or a selected `comfydeploy://...` workflow id.
2. Sends exposed deployment inputs such as prompt, negative prompt, width, height, and image.
3. Polls the ComfyDeploy run endpoint.
4. Downloads the returned output URL and stores it as a data URI.

## Output Support

The resolver extracts assets from common ComfyUI output keys:

- `images`
- `videos`
- `gifs`
- `audio`
- `audios`

This allows image, video, sound, voice, and music workflows to share the same execution path.
