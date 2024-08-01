import { Filter } from '@aitube/clapper-services'

export const hdrToneMapping: Filter = {
  id: 'hdr_tone_mapping',
  label: 'HDR Tone Mapping',
  parameters: [
    {
      id: 'exposure',
      label: 'Exposure',
      description: 'Exposure adjustment',
      type: 'number',
      minValue: -2,
      maxValue: 2,
      defaultValue: 0,
    },
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Contrast adjustment',
      type: 'number',
      minValue: 0.5,
      maxValue: 2,
      defaultValue: 1,
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
      id: 'highlights',
      label: 'Highlights',
      description: 'Highlight adjustment',
      type: 'number',
      minValue: -1,
      maxValue: 1,
      defaultValue: 0,
    },
    {
      id: 'shadows',
      label: 'Shadows',
      description: 'Shadow adjustment',
      type: 'number',
      minValue: -1,
      maxValue: 1,
      defaultValue: 0,
    },
  ],
  shader: `
struct Params {
    exposure: f32,
    contrast: f32,
    saturation: f32,
    highlights: f32,
    shadows: f32,
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

fn reinhard_tone_mapping(hdr: vec3<f32>) -> vec3<f32> {
    return hdr / (hdr + 1.0);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;

    // Apply exposure
    color *= exp2(params.exposure);

    // Apply contrast
    color = pow(color, vec3<f32>(params.contrast));

    // Apply highlights and shadows adjustments
    let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
    let shadow_adjust = 1.0 + params.shadows * (1.0 - luminance);
    let highlight_adjust = 1.0 - params.highlights * luminance;
    color *= shadow_adjust * highlight_adjust;

    // Apply HDR tone mapping
    color = reinhard_tone_mapping(color);

    // Adjust saturation
    var hsv = rgb_to_hsv(color);
    hsv.y *= params.saturation;
    color = hsv_to_rgb(hsv);

    // Ensure color values are within [0, 1] range
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

    textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
  `,
}
