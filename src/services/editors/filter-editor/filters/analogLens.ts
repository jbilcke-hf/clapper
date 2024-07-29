import { Filter } from '@aitube/clapper-services'

export const analogLensSimulator: Filter = {
  id: 'analog_lens_simulator',
  label: 'Analog Lens Simulator',
  parameters: [
    {
      id: 'chromaticAberration',
      label: 'Chromatic aberration',
      description: 'Chromatic aberration strength',
      type: 'number',
      minValue: 0,
      maxValue: 0.05,
      defaultValue: 0.002,
    },
    {
      id: 'vignetteStrength',
      label: 'Vignette strength',
      description: 'Vignette strength',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.3,
    },
    {
      id: 'vignetteRadius',
      label: 'Vignette radius',
      description: 'Vignette radius',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.75,
    },
    {
      id: 'distortion',
      label: 'Distortion',
      description: 'Lens distortion',
      type: 'number',
      minValue: -1,
      maxValue: 1,
      defaultValue: 0.1,
    },
    {
      id: 'bloomStrength',
      label: 'Bloom strength',
      description: 'Bloom strength',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.1,
    },
    {
      id: 'bloomRadius',
      label: 'Bloom radius',
      description: 'Bloom radius',
      type: 'number',
      minValue: 1,
      maxValue: 10,
      defaultValue: 3,
    },
    {
      id: 'dofFocusDistance',
      label: 'DOF focus distance',
      description: 'Depth of field focus distance',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
    {
      id: 'dofFocusRange',
      label: 'DOF focus range',
      description: 'Depth of field focus range',
      type: 'number',
      minValue: 0.01,
      maxValue: 1,
      defaultValue: 0.1,
    },
    {
      id: 'dofBlurStrength',
      label: 'DOF blur strength',
      description: 'Depth of field blur strength',
      type: 'number',
      minValue: 0,
      maxValue: 10,
      defaultValue: 2,
    },
  ],
  shader: `
struct Params {
    chromatic_aberration: f32,
    vignette_strength: f32,
    vignette_radius: f32,
    distortion: f32,
    bloom_strength: f32,
    bloom_radius: f32,
    dof_focus_distance: f32,
    dof_focus_range: f32,
    dof_blur_strength: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

// Helper functions
fn get_uv(coord: vec2<i32>, dimensions: vec2<u32>) -> vec2<f32> {
    return (vec2<f32>(coord) + 0.5) / vec2<f32>(dimensions);
}

fn sample_texture(uv: vec2<f32>) -> vec4<f32> {
    let dimensions = vec2<i32>(textureDimensions(input_texture));
    let coord = vec2<i32>(uv * vec2<f32>(dimensions));
    return textureLoad(input_texture, coord, 0);
}

fn apply_chromatic_aberration(uv: vec2<f32>, strength: f32) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = uv - center;
    
    let r = sample_texture(uv + dist * strength).r;
    let g = sample_texture(uv).g;
    let b = sample_texture(uv - dist * strength).b;
    
    return vec3<f32>(r, g, b);
}

fn apply_vignette(color: vec3<f32>, uv: vec2<f32>, strength: f32, radius: f32) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = distance(uv, center);
    let vignette = smoothstep(radius, radius - 0.05, dist);
    return color * mix(1.0, vignette, strength);
}

fn apply_distortion(uv: vec2<f32>, strength: f32) -> vec2<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = uv - center;
    let r2 = dot(dist, dist);
    let f = 1.0 + r2 * (strength * 0.5);
    return center + dist * f;
}

fn apply_bloom(color: vec3<f32>, uv: vec2<f32>, strength: f32, radius: f32) -> vec3<f32> {
    var blurred_color = vec3<f32>(0.0);
    let dimensions = vec2<f32>(textureDimensions(input_texture));
    let pixel_size = 1.0 / dimensions;

    for (var i = -4; i <= 4; i++) {
        for (var j = -4; j <= 4; j++) {
            let offset = vec2<f32>(f32(i), f32(j)) * pixel_size * radius;
            let sample = sample_texture(uv + offset).rgb;
            let weight = 1.0 - length(offset) / (radius * 5.0 * pixel_size);
            bloom += max(vec3<f32>(0.0), sample - 0.5) * weight;
        }
    }
    
    bloom /= 81.0; // Normalize by the number of samples
    return color + bloom * strength;
}

fn apply_variable_chromatic_aberration(uv: vec2<f32>, strength: f32) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = distance(uv, center);
    let strength_scaled = strength * smoothstep(0.0, 1.0, dist * 2.0);
    
    let dist_vec = (uv - center) * strength_scaled;
    let r = sample_texture(uv + dist_vec).r;
    let g = sample_texture(uv).g;
    let b = sample_texture(uv - dist_vec).b;
    
    return vec3<f32>(r, g, b);
}

fn get_depth(uv: vec2<f32>) -> f32 {
    return textureSample(depth_texture, texture_sampler, uv).r;
}

fn apply_depth_of_field(color: vec3<f32>, uv: vec2<f32>, focus_distance: f32, focus_range: f32, blur_strength: f32) -> vec3<f32> {
    let depth = get_depth(uv);
    let coc = abs(depth - focus_distance) / focus_range;
    let blur_amount = smoothstep(0.0, 1.0, coc) * blur_strength;

    var blurred_color = vec3<f32>(0.0);
    let dimensions = vec2<f32>(textureDimensions(input_texture));
    let pixel_size = 1.0 / dimensions;

    for (var i = -4; i <= 4; i++) {
        for (var j = -4; j <= 4; j++) {
            let offset = vec2<f32>(f32(i), f32(j)) * pixel_size * blur_amount;
            blurred_color += sample_texture(uv + offset).rgb;
        }
    }

    blurred_color /= 81.0; // Normalize by the number of samples
    return mix(color, blurred_color, blur_amount);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let dimensions = textureDimensions(input_texture);
  let coord = vec2<i32>(global_id.xy);

  if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
    return;
  }

  var uv = vec2<f32>(f32(coord.x) / f32(dimensions.x), f32(coord.y) / f32(dimensions.y));

  // Apply lens distortion
  uv = apply_distortion(uv, params.distortion);
  
  // Check if the distorted UV is within bounds
  if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0))) {
    textureStore(output_texture, coord, vec4<f32>(0.0, 0.0, 0.0, 1.0));
    return;
  }
  
  // Apply variable chromatic aberration
  var color = apply_variable_chromatic_aberration(uv, params.chromatic_aberration);
  
  // Apply bloom
  color = apply_bloom(color, uv, params.bloom_strength, params.bloom_radius);
  
  // Apply depth of field
  color = apply_depth_of_field(color, uv, params.dof_focus_distance, params.dof_focus_range, params.dof_blur_strength);
  
  // Apply vignette
  color = apply_vignette(color, uv, params.vignette_strength, params.vignette_radius);
  
  // Ensure color values are within [0, 1] range
  color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

  textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
`,
}
