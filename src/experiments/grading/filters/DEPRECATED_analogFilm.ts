import { ColorGradingFilter } from '../types'

export const analogFilmSimulator: ColorGradingFilter = {
  name: 'Analog Film Simulator',
  parameters: [
    {
      id: 'preset',
      label: 'Preset',
      description: 'Film preset',
      type: 'string',
      allowedValues: [
        'Konica Centuria 200',
        'Kodak Portra 400',
        'Fujifilm Superia 1600',
      ],
      defaultValue: 'Konica Centuria 200',
    },
    {
      id: 'saturation',
      label: 'Saturation',
      description: 'Color saturation',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'noise',
      label: 'Noise',
      description: 'Film grain intensity',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
  ],
  shader: `
struct Params {
  preset: u32,
  saturation: f32,
  noise: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;

// Film preset color matrices
const konica_centuria_200 = mat3x3<f32>(
  1.0, 0.0, 0.0,
  -0.1, 1.1, 0.0,
  0.0, 0.1, 0.9
);

const kodak_portra_400 = mat3x3<f32>(
  1.1, -0.1, 0.0,
  0.0, 1.0, 0.0,
  -0.1, 0.1, 1.0
);

const fujifilm_superia_1600 = mat3x3<f32>(
  1.2, -0.1, -0.1,
  -0.1, 1.1, 0.0,
  0.0, 0.0, 1.0
);

// Helper functions
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

fn apply_film_preset(color: vec3<f32>, preset: u32) -> vec3<f32> {
  switch preset {
      case 0u: { return konica_centuria_200 * color; }
      case 1u: { return kodak_portra_400 * color; }
      case 2u: { return fujifilm_superia_1600 * color; }
      default: { return color; }
  }
}

fn apply_saturation(color: vec3<f32>, saturation: f32) -> vec3<f32> {
  let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
  return mix(vec3<f32>(luminance), color, saturation);
}

fn apply_contrast(color: vec3<f32>, contrast: f32) -> vec3<f32> {
  return (color - 0.5) * contrast + 0.5;
}

fn rand(co: vec2<f32>) -> f32 {
  return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}

fn apply_film_grain(color: vec3<f32>, coord: vec2<f32>, amount: f32) -> vec3<f32> {
  let noise = rand(coord) - 0.5;
  return color + noise * amount;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let dimensions = textureDimensions(input_texture);
  let coord = vec2<i32>(global_id.xy);

  if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
      return;
  }

  var color = textureLoad(input_texture, coord, 0).rgb;

  // Apply film preset
  color = apply_film_preset(color, params.preset);

  // Convert to HSV for saturation adjustment
  var hsv = rgb_to_hsv(color);
  hsv.y *= params.saturation;
  color = hsv_to_rgb(hsv);

  // Apply contrast
  color = apply_contrast(color, 1.1); // Slight increase in contrast

  // Apply film grain
  color = apply_film_grain(color, vec2<f32>(coord), params.noise);

  // Ensure color values are within [0, 1] range
  color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

  textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
`,
}
