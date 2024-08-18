import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const cinematic: Filter = {
  id: 'cinematic_color_grading',
  label: 'Cinematic Color Grading',
  parameters: [
    {
      id: 'preset',
      label: 'Preset',
      description: 'Cinematic color preset',
      category: ClapInputCategory.UNKNOWN,
      type: 'string',
      allowedValues: [
        'Blade Runner',
        'Matrix',
        'Mad Max',
        'Moonlight',
        'Alien',
      ],
      defaultValue: 'Blade Runner',
    },
    {
      id: 'intensity',
      label: 'Intensity',
      description: 'Intensity of the cinematic effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.5,
    },
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Image contrast',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0.5,
      maxValue: 2,
      defaultValue: 1.2,
    },
    {
      id: 'grain',
      label: 'Film Grain',
      description: 'Intensity of film grain effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'blur',
      label: 'Blur',
      description: 'Slight blur effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.1,
    },
  ],
  shader: `
struct Params {
    preset: i32,
    intensity: f32,
    contrast: f32,
    grain: f32,
    blur: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

fn apply_preset(color: vec3<f32>, preset: i32) -> vec3<f32> {
    switch preset {
        case 0: { // Blade Runner
            return color * vec3<f32>(1.05, 0.95, 1.0) + vec3<f32>(0.05, -0.02, 0.02);
        }
        case 1: { // Matrix
            return color * vec3<f32>(0.8, 1.1, 0.8) + vec3<f32>(0.0, 0.1, 0.0);
        }
        case 2: { // Mad Max
            return color * vec3<f32>(1.2, 1.0, 0.7) + vec3<f32>(0.1, 0.05, -0.05);
        }
        case 3: { // Moonlight
            return color * vec3<f32>(0.9, 1.1, 1.2) + vec3<f32>(-0.05, 0.0, 0.1);
        }
        case 4: { // Alien
            return color * vec3<f32>(0.9, 1.05, 1.0) + vec3<f32>(-0.05, 0.02, -0.02);
        }
        default: {
            return color;
        }
    }
}

fn hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(12.9898, 78.233))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2<f32>(0.0, 0.0)), 
                   hash(i + vec2<f32>(1.0, 0.0)), u.x),
               mix(hash(i + vec2<f32>(0.0, 1.0)), 
                   hash(i + vec2<f32>(1.0, 1.0)), u.x), u.y);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;
    
    // Apply contrast
    let contrasted = (color - 0.5) * params.contrast + 0.5;
    
    // Apply preset
    let graded = apply_preset(contrasted, params.preset);
    
    // Apply intensity
    let result_color = mix(color, graded, params.intensity);
    
    // Apply film grain
    let uv = vec2<f32>(f32(coord.x) / f32(dimensions.x), f32(coord.y) / f32(dimensions.y));
    let grain = noise(uv * 1000.0);
    let color_with_grain = mix(result_color, result_color * grain, params.grain);
    
    // Apply slight blur (simple box blur)
    var blurred_color = vec3<f32>(0.0);
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            let sample_coord = coord + vec2<i32>(i, j);
            blurred_color += textureLoad(input_texture, sample_coord, 0).rgb;
        }
    }
    blurred_color /= 9.0;
    
    let final_color = mix(color_with_grain, blurred_color, params.blur);
    
    textureStore(output_texture, coord, vec4<f32>(final_color, 1.0));
}
  `,
}
