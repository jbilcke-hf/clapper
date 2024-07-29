import { Filter } from '@aitube/clapper-services'

// Example filter implementations
export const colorMapping: Filter = {
  id: 'color_mapping',
  label: 'Color Mapping',
  parameters: [
    {
      id: 'redMultiplier',
      label: 'Red multiplier',
      description: 'Red channel multiplier',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'greenMultiplier',
      label: 'Green multiplier',
      description: 'Green channel multiplier',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'blueMultiplier',
      label: 'Blue multiplier',
      description: 'Blue channel multiplier',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
  ],
  shader: `
        @group(0) @binding(0) var inputTexture : texture_2d<f32>;
        @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba8unorm, write>;
        @group(0) @binding(2) var<uniform> params : vec3<f32>;

        @compute @workgroup_size(8, 8)
        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
            let dims = textureDimensions(inputTexture);
            if (global_id.x >= dims.x || global_id.y >= dims.y) {
                return;
            }
            let color = textureLoad(inputTexture, global_id.xy, 0);
            let mapped = vec4<f32>(
                color.r * params.x,
                color.g * params.y,
                color.b * params.z,
                color.a
            );
            textureStore(outputTexture, global_id.xy, mapped);
        }
    `,
}
