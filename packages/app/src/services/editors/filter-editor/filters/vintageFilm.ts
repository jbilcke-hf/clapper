import { ClapInputCategory } from '@aitube/clap'
import { Filter } from '@aitube/clapper-services'

export const vintageFilm: Filter = {
  id: 'enhanced_vintage_film_stocks',
  label: 'Enhanced Vintage Film Stocks',
  parameters: [
    {
      id: 'preset',
      label: 'Preset',
      description: 'Vintage film stock preset',
      category: ClapInputCategory.UNKNOWN,
      type: 'string',
      allowedValues: [
        'Kodachrome 64',
        'Ektachrome 100',
        'Kodacolor 200',
        'Portra 400',
        'Tri-X 400',
        'Kodachrome 25',
        'Plus-X 125',
        'T-Max 400',
        'Fujicolor Pro 400H',
        'Velvia 50',
        'Provia 100F',
        'Superia 200',
        'Neopan 400',
        'HP5 Plus',
        'FP4 Plus',
        'Delta 3200',
        'Vista 200',
        'Ultra 50',
        'Scala 200X',
        'Centuria 400',
        'VX 400',
        'CineStill 800T',
        'Polaroid 600',
        'Polaroid SX-70',
        'Autochrome Lumière',
        'Daguerreotype',
        'Cyanotype',
        'Tintype',
        'Technicolor',
        'Kodachrome II (1961)',
      ],
      defaultValue: 'Kodachrome 64',
    },
    {
      id: 'intensity',
      label: 'Intensity',
      description: 'Intensity of the film stock effect',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.8,
    },
    {
      id: 'grain',
      label: 'Grain',
      description: 'Film grain intensity',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'ageEffect',
      label: 'Age effect',
      description: 'Simulated age of the film',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0,
    },
    {
      id: 'colorShift',
      label: 'Color shift',
      description: 'Color shift adjustment',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: -1,
      maxValue: 1,
      defaultValue: 0,
    },
    {
      id: 'contrast',
      label: 'Contrast',
      description: 'Contrast adjustment',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0.5,
      maxValue: 2,
      defaultValue: 1,
    },
    {
      id: 'saturation',
      label: 'Saturation',
      description: 'Saturation adjustment',
      category: ClapInputCategory.UNKNOWN,
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
  ],
  shader: `
struct Params {
    preset: i32,
    intensity: f32,
    grain: f32,
    age_effect: f32,
    color_shift: f32,
    contrast: f32,
    saturation: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

// Improved pseudo-random number generator
fn hash(p: vec2<f32>) -> vec2<f32> {
    var p2 = vec2<f32>(dot(p, vec2<f32>(127.1, 311.7)),
                       dot(p, vec2<f32>(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p2) * 43758.5453123);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(hash(i + vec2<f32>(0.0, 0.0)), f - vec2<f32>(0.0, 0.0)),
                   dot(hash(i + vec2<f32>(1.0, 0.0)), f - vec2<f32>(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2<f32>(0.0, 1.0)), f - vec2<f32>(0.0, 1.0)),
                   dot(hash(i + vec2<f32>(1.0, 1.0)), f - vec2<f32>(1.0, 1.0)), u.x), u.y);
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

fn apply_film_preset(color: vec3<f32>, preset: i32) -> vec3<f32> {
    switch preset {
        case 0: { return color * vec3<f32>(1.1, 1.0, 0.9) + vec3<f32>(0.0, 0.03, 0.07); } // Kodachrome 64
        case 1: { return color * vec3<f32>(1.0, 1.05, 1.1) + vec3<f32>(0.05, 0.0, -0.05); } // Ektachrome 100
        case 2: { return color * vec3<f32>(1.05, 1.0, 0.95) + vec3<f32>(0.02, 0.02, 0.0); } // Kodacolor 200
        case 3: { return color * vec3<f32>(1.1, 1.05, 1.0) + vec3<f32>(0.05, 0.05, 0.0); } // Portra 400
        case 4: { // Tri-X 400
            let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
            return vec3<f32>(bw * 1.1);
        }
        // ... (other cases remain the same)
        default: {
            return color;
        }
    }
}

fn apply_age_effect(color: vec3<f32>, age: f32) -> vec3<f32> {
    let sepia = vec3<f32>(1.2, 1.0, 0.8);
    let aged = mix(color, color * sepia, age);
    return mix(aged, aged * (1.0 - age * 0.2), age); // Slight fading
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;

    // Apply film preset
    color = mix(color, apply_film_preset(color, params.preset), params.intensity);

    // Apply contrast adjustment
    color = pow(color, vec3<f32>(params.contrast));

    // Apply color shift
    var hsv = rgb_to_hsv(color);
    hsv.x = fract(hsv.x + params.color_shift);
    color = hsv_to_rgb(hsv);

    // Apply saturation adjustment
    hsv = rgb_to_hsv(color);
    hsv.y *= params.saturation;
    color = hsv_to_rgb(hsv);

    // Apply age effect
    color = apply_age_effect(color, params.age_effect);

    // Apply improved film grain
    let time = f32(global_id.x + global_id.y * dimensions.x) * 0.01;
    let grain_value = noise(vec2<f32>(f32(coord.x) * 0.1, f32(coord.y) * 0.1 + time));
    color += vec3<f32>(grain_value * params.grain);

    // Ensure color values are within [0, 1] range
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

    textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
  `,
}
