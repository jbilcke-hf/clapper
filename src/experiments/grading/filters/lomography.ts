import { ColorGradingFilter } from '../types'

export const lomography: ColorGradingFilter = {
  name: 'Lomography',
  parameters: [
    {
      id: 'saturation',
      label: 'Saturation',
      description: 'Color saturation',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1.3,
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
    {
      id: 'vignetteIntensity',
      label: 'Vignette intensity',
      description: 'Intensity of vignette effect',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
    {
      id: 'lightLeakIntensity',
      label: 'Light leak intensity',
      description: 'Intensity of light leak effect',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
  ],
  shader: `
    struct Params {
      saturation: f32,
      contrast: f32,
      vignette_intensity: f32,
      light_leak_intensity: f32,
    }

    @group(0) @binding(0) var input_texture: texture_2d<f32>;
    @group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
    @group(0) @binding(2) var<uniform> params: Params;

    fn rgb_to_hsv(rgb: vec3<f32>) -> vec3<f32> {
      let v = max(max(rgb.r, rgb.g), rgb.b);
      let c = v - min(min(rgb.r, rgb.g), rgb.b);
      let s = select(0.0, c / v, v != 0.0);
      
      var h: f32;
      if (c == 0.0) {
        h = 0.0;
      } else if (v == rgb.r) {
        h = (rgb.g - rgb.b) / c;
      } else if (v == rgb.g) {
        h = 2.0 + (rgb.b - rgb.r) / c;
      } else {
        h = 4.0 + (rgb.r - rgb.g) / c;
      }
      h = fract(h / 6.0);

      return vec3<f32>(h, s, v);
    }

    fn hsv_to_rgb(hsv: vec3<f32>) -> vec3<f32> {
      let h = hsv.x * 6.0;
      let s = hsv.y;
      let v = hsv.z;

      let c = v * s;
      let x = c * (1.0 - abs(fract(h / 2.0) * 2.0 - 1.0));
      let m = v - c;

      var rgb: vec3<f32>;
      if (h < 1.0) {
        rgb = vec3<f32>(c, x, 0.0);
      } else if (h < 2.0) {
        rgb = vec3<f32>(x, c, 0.0);
      } else if (h < 3.0) {
        rgb = vec3<f32>(0.0, c, x);
      } else if (h < 4.0) {
        rgb = vec3<f32>(0.0, x, c);
      } else if (h < 5.0) {
        rgb = vec3<f32>(x, 0.0, c);
      } else {
        rgb = vec3<f32>(c, 0.0, x);
      }

      return rgb + vec3<f32>(m);
    }

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

      // Convert to HSV
      var hsv = rgb_to_hsv(color);

      // Increase saturation
      hsv.y = clamp(hsv.y * params.saturation, 0.0, 1.0);

      // Convert back to RGB
      color = hsv_to_rgb(hsv);

      // Apply contrast
      color = (color - 0.5) * params.contrast + 0.5;

      // Apply vignette
      let center = vec2<f32>(0.5, 0.5);
      let uv = vec2<f32>(coord) / vec2<f32>(dimensions);
      let dist = distance(uv, center);
      let vignette = 1.0 - smoothstep(0.3, 0.7, dist * params.vignette_intensity);
      color *= vignette;

      // Apply light leak
      let leak = rand(uv * 10.0);
      let leak_color = vec3<f32>(1.0, 0.5, 0.2); // Warm light leak color
      color = mix(color, leak_color, leak * params.light_leak_intensity);

      // Ensure color values are within [0, 1] range
      color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(color, 1.0));
    }
  `,
}
