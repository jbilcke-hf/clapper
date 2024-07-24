import { ColorGradingFilter } from '../types'

export const infraredBlackAndWhite: ColorGradingFilter = {
  name: 'Infrared Black and White',
  parameters: [
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Image contrast',
      type: 'number',
      minValue: 0.5,
      maxValue: 2.0,
      defaultValue: 1.2,
    },
    {
      id: 'grain',
      label: 'Grain',
      description: 'Film grain intensity',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'glow',
      label: 'Glow',
      description: 'Infrared glow effect',
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

    fn rand(co: vec2<f32>) -> f32 {
      return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453);
    }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let dimensions = textureDimensions(input_texture);
      let coord = vec2<i32>(global_id.xy);

      if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
        return;
      }

      var color = textureLoad(input_texture, coord, 0).rgb;

      // Convert to infrared-like grayscale
      let ir_gray = dot(color, vec3<f32>(0.2, 0.7, 0.1));

      // Apply contrast
      let contrasted = (ir_gray - 0.5) * params.contrast + 0.5;

      // Apply glow effect
      var glow_sum = vec3<f32>(0.0);
      let glow_radius = 5;
      for (var i = -glow_radius; i <= glow_radius; i++) {
        for (var j = -glow_radius; j <= glow_radius; j++) {
          let sample_coord = coord + vec2<i32>(i, j);
          if (sample_coord.x >= 0 && sample_coord.x < dimensions.x &&
              sample_coord.y >= 0 && sample_coord.y < dimensions.y) {
            let sample = textureLoad(input_texture, sample_coord, 0).rgb;
            let sample_gray = dot(sample, vec3<f32>(0.2, 0.7, 0.1));
            glow_sum += vec3<f32>(sample_gray);
          }
        }
      }
      let glow_avg = glow_sum / f32((2 * glow_radius + 1) * (2 * glow_radius + 1));
      let glowed = mix(vec3<f32>(contrasted), glow_avg, params.glow);

      // Apply grain
      let grain = (rand(vec2<f32>(coord)) - 0.5) * params.grain;
      let final_color = clamp(glowed + grain, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(final_color, 1.0));
    }
  `,
}
