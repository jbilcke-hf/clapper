We are going to need to support multiple rendering modes

The easiest is the case where we already have a video to show,
let's call it the "full" mode, which we can render using <StaticPlayer />

Then we have the "dynamic" mode, where we recompose a video from separate assets.
This mode can be rendered using <DynamicPlayer />