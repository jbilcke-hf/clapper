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
      maxValue: 1,
      defaultValue: 0,
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

fn sample_texture(coord: vec2<i32>) -> vec4<f32> {
    return textureLoad(input_texture, coord, 0);
}

fn apply_chromatic_aberration(uv: vec2<f32>, strength: f32, dimensions: vec2<i32>) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = uv - center;
    
    let r_coord = vec2<i32>((uv + dist * strength) * vec2<f32>(dimensions));
    let g_coord = vec2<i32>(uv * vec2<f32>(dimensions));
    let b_coord = vec2<i32>((uv - dist * strength) * vec2<f32>(dimensions));
    
    let r = sample_texture(r_coord).r;
    let g = sample_texture(g_coord).g;
    let b = sample_texture(b_coord).b;
    
    return vec3<f32>(r, g, b);
}

fn apply_vignette(color: vec3<f32>, uv: vec2<f32>, strength: f32, radius: f32) -> vec3<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = distance(uv, center);
    let vignette = smoothstep(radius, radius - 0.05, dist);
    return color * mix(1.0, vignette, strength);
}

fn apply_distortion_and_zoom(uv: vec2<f32>, strength: f32) -> vec2<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = uv - center;
    let r2 = dot(dist, dist);
    
    // Apply distortion
    let f = 1.0 + r2 * (strength * 0.5);
    var distorted_uv = center + dist * f;
    
    // Apply progressive zoom when distortion is positive
    if (strength > 0.0) {
        // Calculate zoom factor based on distortion strength
        let zoom_factor = 1.0 + strength * 0.5;
        
        // Apply zoom
        distorted_uv = (distorted_uv - center) / zoom_factor + center;
    }
    
    return distorted_uv;
}

fn apply_bloom(color: vec3<f32>, uv: vec2<f32>, strength: f32, radius: f32, dimensions: vec2<i32>) -> vec3<f32> {
    var bloom = vec3<f32>(0.0);
    let pixel_size = 1.0 / vec2<f32>(dimensions);

    for (var i = -4; i <= 4; i++) {
        for (var j = -4; j <= 4; j++) {
            let offset = vec2<f32>(f32(i), f32(j)) * pixel_size * radius;
            let sample_coord = vec2<i32>((uv + offset) * vec2<f32>(dimensions));
            let sample = sample_texture(sample_coord).rgb;
            let weight = 1.0 - length(offset) / (radius * 5.0 * length(pixel_size));
            bloom += max(vec3<f32>(0.0), sample - 0.5) * weight;
        }
    }
    
    bloom /= 81.0; // Normalize by the number of samples
    return color + bloom * strength;
}

fn get_depth(coord: vec2<i32>) -> f32 {
    return textureLoad(depth_texture, coord, 0).r;
}

fn apply_depth_of_field(color: vec3<f32>, uv: vec2<f32>, focus_distance: f32, focus_range: f32, blur_strength: f32, dimensions: vec2<i32>) -> vec3<f32> {
    let depth = get_depth(vec2<i32>(uv * vec2<f32>(dimensions)));
    let coc = abs(depth - focus_distance) / focus_range;
    let blur_amount = smoothstep(0.0, 1.0, coc) * blur_strength;

    var blurred_color = vec3<f32>(0.0);
    let pixel_size = 1.0 / vec2<f32>(dimensions);

    for (var i = -4; i <= 4; i++) {
        for (var j = -4; j <= 4; j++) {
            let offset = vec2<f32>(f32(i), f32(j)) * pixel_size * blur_amount;
            let sample_coord = vec2<i32>((uv + offset) * vec2<f32>(dimensions));
            blurred_color += sample_texture(sample_coord).rgb;
        }
    }

    blurred_color /= 81.0; // Normalize by the number of samples
    return mix(color, blurred_color, blur_amount);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = vec2<i32>(textureDimensions(input_texture));
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
        return;
    }

    var uv = vec2<f32>(coord) / vec2<f32>(dimensions);

    // Apply lens distortion and zoom
    uv = apply_distortion_and_zoom(uv, params.distortion);
  
    // Check if the distorted UV is within bounds
    if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0))) {
        textureStore(output_texture, coord, vec4<f32>(0.0, 0.0, 0.0, 1.0));
        return;
    }
  
    // Apply variable chromatic aberration
    var color = apply_chromatic_aberration(uv, params.chromatic_aberration, dimensions);
  
    // Apply bloom
    color = apply_bloom(color, uv, params.bloom_strength, params.bloom_radius, dimensions);
  
    // Apply depth of field
    color = apply_depth_of_field(color, uv, params.dof_focus_distance, params.dof_focus_range, params.dof_blur_strength, dimensions);
  
    // Apply vignette
    color = apply_vignette(color, uv, params.vignette_strength, params.vignette_radius);
  
    // Ensure color values are within [0, 1] range
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

    // Get the original alpha value from the input texture
    let original_alpha = textureLoad(input_texture, coord, 0).a;

    // Store the result with the original alpha value
    textureStore(output_texture, coord, vec4<f32>(color, original_alpha));
}
`,
}
