import { Filter } from '@aitube/clapper-services'

export const splitToning: Filter = {
  id: 'split_toning',
  label: 'Split Toning',
  parameters: [
    {
      id: 'highlightColor',
      label: 'Highlight color',
      description: 'Color for highlights',
      type: 'string',
      allowedValues: ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta'],
      defaultValue: 'Yellow',
    },
    {
      id: 'shadowColor',
      label: 'Shadow color',
      description: 'Color for shadows',
      type: 'string',
      allowedValues: ['Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta'],
      defaultValue: 'Blue',
    },
    {
      id: 'balance',
      label: 'Balance',
      description: 'Balance between highlights and shadows',
      type: 'number',
      minValue: -1,
      maxValue: 1,
      defaultValue: 0,
    },
    {
      id: 'intensity',
      label: 'Intensity',
      description: 'Intensity of the split toning effect',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
  ],
  shader: `
    struct Params {
      highlight_color: u32,
      shadow_color: u32,
      balance: f32,
      intensity: f32,
    }

    @group(0) @binding(0) var input_texture: texture_2d<f32>;
    @group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
    @group(0) @binding(2) var<uniform> params: Params;

    fn get_color(color_index: u32) -> vec3<f32> {
      switch color_index {
        case 0u: { return vec3<f32>(1.0, 0.0, 0.0); } // Red
        case 1u: { return vec3<f32>(0.0, 1.0, 0.0); } // Green
        case 2u: { return vec3<f32>(0.0, 0.0, 1.0); } // Blue
        case 3u: { return vec3<f32>(1.0, 1.0, 0.0); } // Yellow
        case 4u: { return vec3<f32>(0.0, 1.0, 1.0); } // Cyan
        case 5u: { return vec3<f32>(1.0, 0.0, 1.0); } // Magenta
        default: { return vec3<f32>(1.0); } // White
      }
    }

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

      let highlight_color = get_color(params.highlight_color);
      let shadow_color = get_color(params.shadow_color);

      // Calculate toning based on luminance and balance
      let lum = dot(color, vec3<f32>(0.299, 0.587, 0.114));
      let toning_factor = smoothstep(0.0, 1.0, lum + params.balance);
      let toning_color = mix(shadow_color, highlight_color, toning_factor);

      // Apply split toning
      hsv.x = mix(hsv.x, rgb_to_hsv(toning_color).x, params.intensity * (1.0 - hsv.y));
      hsv.y = mix(hsv.y, rgb_to_hsv(toning_color).y, params.intensity * 0.3);

      // Convert back to RGB
      color = hsv_to_rgb(hsv);

      // Ensure color values are within [0, 1] range
      color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(color, 1.0));
    }
  `,
}
