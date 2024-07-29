import { Filter } from '@aitube/clapper-services'

export const cinematic: Filter = {
  id: 'cinematic_color_grading',
  label: 'Cinematic Color Grading',
  parameters: [
    {
      id: 'preset',
      label: 'Preset',
      description: 'Cinematic color preset',
      type: 'string',
      allowedValues: [
        'Blade Runner',
        'Matrix',
        'Mad Max',
        'Moonlight',
        'La La Land',
      ],
      defaultValue: 'Blade Runner',
    },
    {
      id: 'intensity',
      label: 'Intensity',
      description: 'Intensity of the cinematic effect',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Image contrast',
      type: 'number',
      minValue: 0.5,
      maxValue: 2,
      defaultValue: 1.2,
    },
  ],
  shader: `
    struct Params {
      preset: u32,
      intensity: f32,
      contrast: f32,
    }

    @group(0) @binding(0) var input_texture: texture_2d<f32>;
    @group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
    @group(0) @binding(2) var<uniform> params: Params;

    fn apply_preset(color: vec3<f32>, preset: u32) -> vec3<f32> {
      switch preset {
        case 0u: { // Blade Runner
          return mix(color, color * vec3<f32>(0.9, 1.1, 1.5), params.intensity);
        }
        case 1u: { // Matrix
          return mix(color, color * vec3<f32>(0.8, 1.2, 0.8), params.intensity);
        }
        case 2u: { // Mad Max
          return mix(color, color * vec3<f32>(1.2, 1.0, 0.8), params.intensity);
        }
        case 3u: { // Moonlight
          return mix(color, color * vec3<f32>(0.9, 1.0, 1.2), params.intensity);
        }
        case 4u: { // La La Land
          return mix(color, color * vec3<f32>(1.1, 1.0, 0.9), params.intensity);
        }
        default: {
          return color;
        }
      }
    }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let dimensions = textureDimensions(input_texture);
      let coord = vec2<i32>(global_id.xy);

      if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
        return;
      }

      var color = textureLoad(input_texture, coord, 0).rgb;

      // Apply contrast
      color = (color - 0.5) * params.contrast + 0.5;

      // Apply cinematic color preset
      color = apply_preset(color, params.preset);

      // Add subtle vignette effect
      let uv = vec2<f32>(coord) / vec2<f32>(dimensions);
      let vignette = 1.0 - smoothstep(0.5, 1.5, distance(uv, vec2<f32>(0.5)));
      color *= mix(1.0, vignette, 0.2);

      // Ensure color values are within [0, 1] range
      color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(color, 1.0));
    }
  `,
}
