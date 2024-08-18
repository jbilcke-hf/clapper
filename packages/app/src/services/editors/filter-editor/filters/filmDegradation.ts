import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const filmDegradation: Filter = {
  id: 'film_degradation',
  label: 'Film Degradation',
  parameters: [
    {
      id: 'scratchesIntensity',
      label: 'Scratches intensity',
      description: 'Intensity of film scratches',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'dustIntensity',
      label: 'Dust intensity',
      description: 'Intensity of dust and spots',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'grainIntensity',
      label: 'Grain intensity',
      description: 'Intensity of film grain',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.15,
    },
    {
      id: 'colorFading',
      label: 'Color fading',
      description: 'Color fading effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'vignettingIntensity',
      label: 'Vignetting intensity',
      description: 'Intensity of vignetting effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.05,
    },
    {
      id: 'flickerIntensity',
      label: 'Flicker intensity',
      description: 'Intensity of light flickering',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.1,
    },
    {
      id: 'lightLeakIntensity',
      label: 'Light leak intensity',
      description: 'Intensity of light leaks',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'filmType',
      label: 'Film type',
      description: 'Type of film to simulate',
      category: ClapInputCategory.UNKNOWN,
      type: 'string',
      allowedValues: ['color', 'blackAndWhite', 'sepia'],
      defaultValue: 'color',
    },
  ],
  shader: `
struct Params {
    scratches_intensity: f32,
    dust_intensity: f32,
    grain_intensity: f32,
    color_fading: f32,
    vignetting_intensity: f32,
    flicker_intensity: f32,
    light_leak_intensity: f32,
    film_type: i32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

fn hash(p: vec2<f32>) -> vec2<f32> {
    var p2 = vec2<f32>(dot(p, vec2<f32>(127.1, 311.7)),
                       dot(p, vec2<f32>(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p2) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(hash(i + vec2<f32>(0.0, 0.0)), f - vec2<f32>(0.0, 0.0)),
                   dot(hash(i + vec2<f32>(1.0, 0.0)), f - vec2<f32>(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2<f32>(0.0, 1.0)), f - vec2<f32>(0.0, 1.0)),
                   dot(hash(i + vec2<f32>(1.0, 1.0)), f - vec2<f32>(1.0, 1.0)), u.x), u.y);
}

fn fbm(coord: vec2<f32>) -> f32 {
    var f = 0.0;
    var w = 0.5;
    var p = coord;
    for (var i = 0; i < 5; i = i + 1) {
        f += w * noise(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f;
}

fn scratch(coord: vec2<f32>, time: f32) -> f32 {
    var s = fbm(vec2<f32>(coord.x * 0.01, time * 0.1)) * 2.0 - 1.0;
    s = 0.5 + 0.5 * s;
    s *= fbm(vec2<f32>(coord.y * 50.0, time * 10.0)) * 2.0 - 1.0;
    return smoothstep(1.0 - params.scratches_intensity * 0.5, 1.0, abs(s));
}

fn dust(coord: vec2<f32>, time: f32) -> f32 {
    let n = fbm(coord * 10.0 + time * 0.1);
    return step(1.0 - params.dust_intensity * 0.5, n);
}

fn grain(coord: vec2<f32>, time: f32) -> f32 {
    return (noise(coord * 250.0 + time * 50.0) - 0.5) * params.grain_intensity * 0.3;
}

fn vignette(coord: vec2<f32>, intensity: f32) -> f32 {
    let d = distance(coord, vec2<f32>(0.5, 0.5));
    return smoothstep(0.8, 0.25, d * (1.0 + intensity * 2.0));
}

fn lightLeak(coord: vec2<f32>, time: f32) -> vec3<f32> {
    let n = fbm(coord * 0.5 + time * 0.05);
    let leak = smoothstep(0.5, 1.0, n) * params.light_leak_intensity;
    return vec3<f32>(1.0, 0.6, 0.3) * leak * 2.0;
}

fn getFilmColor(color: vec3<f32>, film_type: i32) -> vec3<f32> {
    if (film_type == 1) {  // Black and White
        let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
        return vec3<f32>(luminance);
    } else if (film_type == 2) {  // Sepia
        let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
        return vec3<f32>(
            luminance * 1.35,
            luminance * 1.1,
            luminance * 0.65
        );
    }
    return color;  // Color (default)
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    let uv = vec2<f32>(f32(coord.x) / f32(dimensions.x), f32(coord.y) / f32(dimensions.y));
    var color = textureLoad(input_texture, coord, 0).rgb;

    // Apply color fading
    color = mix(color, vec3<f32>(0.5), params.color_fading);

    // Apply film type
    color = getFilmColor(color, params.film_type);

    // Apply scratches
    let scratch_value = scratch(vec2<f32>(coord), f32(global_id.z));
    color = mix(color, vec3<f32>(1.0), scratch_value * 0.7);

    // Apply dust and spots
    let dust_value = dust(uv, f32(global_id.z));
    color = mix(color, vec3<f32>(0.1), dust_value * 0.8);

    // Apply film grain
    let grain_value = grain(uv, f32(global_id.z));
    color += vec3<f32>(grain_value);

    // Apply vignette
    let vignette_value = vignette(uv, params.vignetting_intensity);
    color *= vignette_value;

    // Apply light flicker
    let flicker = 1.0 - params.flicker_intensity * 0.3 * noise(vec2<f32>(0.0, f32(global_id.z) * 0.01));
    color *= flicker;

    // Apply light leak
    let leak = lightLeak(uv, f32(global_id.z));
    color += leak;

    // Ensure color values are within [0, 1] range
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

    textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
  `,
}
