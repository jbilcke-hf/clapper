import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const infraredBlackAndWhite: Filter = {
  id: 'infrared_black_and_white',
  label: 'Infrared Black and White',
  parameters: [
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Image contrast',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0.5,
      maxValue: 2.0,
      defaultValue: 1.2,
    },
    {
      id: 'grain',
      label: 'Grain',
      description: 'Film grain intensity',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'glow',
      label: 'Glow',
      description: 'Infrared glow effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
  ],
  shader: `
struct Params {
    contrast: f32,
    grain: f32,
    glow: f32,
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

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;

    // ... (other effects remain unchanged)

    // Apply improved film grain
    let grain_value = noise(vec2<f32>(f32(coord.x), f32(coord.y)) * 0.1);
    let final_color = clamp(color + vec3<f32>(grain_value * params.grain), vec3<f32>(0.0), vec3<f32>(1.0));

    textureStore(output_texture, coord, vec4<f32>(final_color, 1.0));
}
  `,
}
