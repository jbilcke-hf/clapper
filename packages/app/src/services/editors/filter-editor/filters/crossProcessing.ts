import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const crossProcessing: Filter = {
  id: 'cross_processing',
  label: 'Cross-Processing',
  parameters: [
    {
      id: 'intensity',
      label: 'Intensity',
      description: 'Intensity of the cross-processing effect',
      type: 'number',
      category: ClapInputCategory.UNKNOWN,
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
    {
      id: 'contrastBoost',
      label: 'Contrast boost',
      description: 'Amount of contrast boost',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'colorShift',
      label: 'Color shift',
      description: 'Direction of color shift',
      category: ClapInputCategory.UNKNOWN,
      type: 'string',
      allowedValues: ['Cool', 'Warm'],
      defaultValue: 'Cool',
    },
  ],
  shader: `
struct Params {
    intensity: f32,
    contrast_boost: f32,
    color_shift: u32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

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

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;

    // Convert to HSV
    var hsv = rgb_to_hsv(color);

    // Apply color shift
    if (params.color_shift == 0u) { // Cool shift
        hsv.x = fract(hsv.x - 0.1 * params.intensity);
    } else { // Warm shift
        hsv.x = fract(hsv.x + 0.1 * params.intensity);
    }

    // Increase saturation
    hsv.y = clamp(hsv.y + 0.2 * params.intensity, 0.0, 1.0);

    // Convert back to RGB
    color = hsv_to_rgb(hsv);

    // Apply contrast boost
    color = (color - 0.5) * (1.0 + params.contrast_boost) + 0.5;

    // Adjust individual channels for cross-processing look
    color.r = clamp(color.r + 0.1 * params.intensity, 0.0, 1.0);
    color.g = clamp(color.g - 0.05 * params.intensity, 0.0, 1.0);
    color.b = clamp(color.b + 0.15 * params.intensity, 0.0, 1.0);

    textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
  `,
}
