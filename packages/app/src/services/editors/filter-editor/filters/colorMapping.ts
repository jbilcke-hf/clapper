import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const colorMapping: Filter = {
  id: 'color_mapping',
  label: 'Color Mapping',
  parameters: [
    {
      id: 'redMultiplier',
      label: 'Red multiplier',
      description: 'Red channel multiplier',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'greenMultiplier',
      label: 'Green multiplier',
      description: 'Green channel multiplier',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'blueMultiplier',
      label: 'Blue multiplier',
      description: 'Blue channel multiplier',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
  ],
  shader: `
struct Params {
    red_multiplier: f32,
    green_multiplier: f32,
    blue_multiplier: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    let color = textureLoad(input_texture, coord, 0);
    let mapped = vec4<f32>(
        color.r * params.red_multiplier,
        color.g * params.green_multiplier,
        color.b * params.blue_multiplier,
        color.a
    );

    textureStore(output_texture, coord, mapped);
}
  `,
}
