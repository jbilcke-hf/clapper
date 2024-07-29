import { Filter } from '@aitube/clapper-services'

export const filmDegradation: Filter = {
  id: 'film_degradation',
  label: 'Film Degradation',
  parameters: [
    {
      id: 'scratchesIntensity',
      label: 'Scratches intensity',
      description: 'Intensity of film scratches',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'dustIntensity',
      label: 'Dust intensity',
      description: 'Intensity of dust and spots',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'colorFading',
      label: 'Color fading',
      description: 'Color fading effect',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'lightLeakIntensity',
      label: 'Light leak intensity',
      description: 'Intensity of light leaks',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
  ],
  shader: `
    struct Params {
      scratches_intensity: f32,
      dust_intensity: f32,
      color_fading: f32,
      light_leak_intensity: f32,
    }

    @group(0) @binding(0) var input_texture: texture_2d<f32>;
    @group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
    @group(0) @binding(2) var<uniform> params: Params;

    fn rand(co: vec2<f32>) -> f32 {
      return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453);
    }

    fn noise(p: vec2<f32>) -> f32 {
      let ip = floor(p);
      let u = fract(p);
      let u2 = u * u * (3.0 - 2.0 * u);
      
      let n00 = rand(ip);
      let n01 = rand(ip + vec2<f32>(0.0, 1.0));
      let n10 = rand(ip + vec2<f32>(1.0, 0.0));
      let n11 = rand(ip + vec2<f32>(1.0, 1.0));
      
      return mix(mix(n00, n10, u2.x), mix(n01, n11, u2.x), u2.y);
    }

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let dimensions = textureDimensions(input_texture);
      let coord = vec2<i32>(global_id.xy);

      if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
        return;
      }

      var color = textureLoad(input_texture, coord, 0).rgb;

      // Apply color fading
      color = mix(color, vec3<f32>(0.5), params.color_fading);

      // Apply scratches
      let scratch = noise(vec2<f32>(coord.y * 0.1, 0.0));
      if (scratch > 1.0 - params.scratches_intensity * 0.1) {
        color += vec3<f32>(0.1);
      }

      // Apply dust and spots
      let dust = noise(vec2<f32>(coord) * 0.02);
      if (dust < params.dust_intensity * 0.2) {
        color -= vec3<f32>(0.1);
      }

      // Apply light leak
      let leak = noise(vec2<f32>(coord) * 0.005);
      color += vec3<f32>(1.0, 0.5, 0.0) * leak * params.light_leak_intensity;

      // Ensure color values are within [0, 1] range
      color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(color, 1.0));
    }
  `,
}
