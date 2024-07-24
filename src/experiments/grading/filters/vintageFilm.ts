import { ColorGradingFilter } from '../types'

export const vintageFilm: ColorGradingFilter = {
  name: 'Enhanced Vintage Film Stocks',
  parameters: [
    {
      id: 'preset',
      label: 'Preset',
      description: 'Vintage film stock preset',
      type: 'string',
      allowedValues: [
        // Kodak films
        'Kodachrome 64',
        'Ektachrome 100',
        'Kodacolor 200',
        'Portra 400',
        'Tri-X 400',
        'Kodachrome 25',
        'Plus-X 125',
        'T-Max 400',
        // Fujifilm
        'Fujicolor Pro 400H',
        'Velvia 50',
        'Provia 100F',
        'Superia 200',
        'Neopan 400',
        // Ilford
        'HP5 Plus',
        'FP4 Plus',
        'Delta 3200',
        // Agfa
        'Vista 200',
        'Ultra 50',
        'Scala 200X',
        // Konica
        'Centuria 400',
        'VX 400',
        // Other brands
        'CineStill 800T',
        'Polaroid 600',
        'Polaroid SX-70',
        // Exotic and old formats
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
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.8,
    },
    {
      id: 'grain',
      label: 'Grain',
      description: 'Film grain intensity',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0.2,
    },
    {
      id: 'ageEffect',
      label: 'Age effect',
      description: 'Simulated age of the film',
      type: 'number',
      minValue: 0,
      maxValue: 1,
      defaultValue: 0,
    },
    {
      id: 'colorShift',
      label: 'Color shift',
      description: 'Color shift adjustment',
      type: 'number',
      minValue: -1,
      maxValue: 1,
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
      description: 'Saturation adjustment',
      type: 'number',
      minValue: 0,
      maxValue: 2,
      defaultValue: 1,
    },
  ],
  shader: `
    struct Params {
      preset: u32,
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

    fn rand(co: vec2<f32>) -> f32 {
      return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453);
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

      fn apply_film_preset(color: vec3<f32>, preset: u32) -> vec3<f32> {
      switch preset {
        // Kodak films
        case 0u: { return color * vec3<f32>(1.1, 1.0, 0.9) + vec3<f32>(0.0, 0.03, 0.07); } // Kodachrome 64
        case 1u: { return color * vec3<f32>(1.0, 1.05, 1.1) + vec3<f32>(0.05, 0.0, -0.05); } // Ektachrome 100
        case 2u: { return color * vec3<f32>(1.05, 1.0, 0.95) + vec3<f32>(0.02, 0.02, 0.0); } // Kodacolor 200
        case 3u: { return color * vec3<f32>(1.1, 1.05, 1.0) + vec3<f32>(0.05, 0.05, 0.0); } // Portra 400
        case 4u: { // Tri-X 400
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.1);
        }
        case 5u: { return color * vec3<f32>(1.2, 1.1, 0.9) + vec3<f32>(-0.05, 0.05, 0.1); } // Kodachrome 25
        case 6u: { // Plus-X 125
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.05 + 0.02);
        }
        case 7u: { // T-Max 400
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.15 - 0.05);
        }
        // Fujifilm
        case 8u: { return color * vec3<f32>(1.05, 1.1, 1.15) + vec3<f32>(0.1, 0.0, 0.1); } // Fujicolor Pro 400H
        case 9u: { return color * vec3<f32>(1.2, 1.1, 1.0) + vec3<f32>(0.0, 0.1, 0.2); } // Velvia 50
        case 10u: { return color * vec3<f32>(1.05, 1.05, 1.1) + vec3<f32>(0.05, 0.05, 0.0); } // Provia 100F
        case 11u: { return color * vec3<f32>(1.1, 1.05, 0.95) + vec3<f32>(0.0, 0.05, 0.1); } // Superia 200
        case 12u: { // Neopan 400
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.1 - 0.03);
        }
        // Ilford
        case 13u: { // HP5 Plus
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.05 + 0.05);
        }
        case 14u: { // FP4 Plus
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.02 + 0.02);
        }
        case 15u: { // Delta 3200
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.2 - 0.1);
        }
        // Agfa
        case 16u: { return color * vec3<f32>(1.05, 1.0, 0.95) + vec3<f32>(0.05, 0.0, -0.05); } // Vista 200
        case 17u: { return color * vec3<f32>(1.1, 1.05, 0.9) + vec3<f32>(0.0, 0.05, 0.1); } // Ultra 50
        case 18u: { // Scala 200X
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw * 1.1 + 0.05);
        }
        // Konica
        case 19u: { return color * vec3<f32>(1.05, 1.1, 1.0) + vec3<f32>(0.05, 0.0, 0.05); } // Centuria 400
        case 20u: { return color * vec3<f32>(1.1, 1.05, 0.95) + vec3<f32>(0.0, 0.05, 0.1); } // VX 400
        // Other brands
        case 21u: { return color * vec3<f32>(1.1, 1.0, 1.2) + vec3<f32>(0.1, 0.0, -0.1); } // CineStill 800T
        case 22u: { return color * vec3<f32>(1.15, 1.1, 1.0) + vec3<f32>(0.05, 0.0, -0.05); } // Polaroid 600
        case 23u: { return color * vec3<f32>(1.2, 1.15, 0.9) + vec3<f32>(0.1, 0.05, -0.1); } // Polaroid SX-70
        // Exotic and old formats
        case 24u: { // Autochrome Lumière
          var sepia = rgb_to_hsv(color);
          sepia.x = 0.08; // Hue shift towards sepia
          sepia.y *= 0.7; // Reduce saturation
          return hsv_to_rgb(sepia) * vec3<f32>(1.1, 1.0, 0.8);
        }
        case 25u: { // Daguerreotype
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw) * vec3<f32>(0.9, 1.0, 1.1) + vec3<f32>(0.1, 0.1, 0.1);
        }
        case 26u: { // Cyanotype
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(0.2, 0.4, 0.6) + bw * vec3<f32>(0.1, 0.3, 0.5);
        }
        case 27u: { // Tintype
          let bw = dot(color, vec3<f32>(0.299, 0.587, 0.114));
          return vec3<f32>(bw) * vec3<f32>(0.8, 0.8, 0.9) + vec3<f32>(0.1, 0.1, 0.05);
        }
        case 28u: { // Technicolor
          return color * vec3<f32>(1.3, 1.1, 1.0) + vec3<f32>(0.0, 0.1, 0.2);
        }
        case 29u: { // Kodachrome II (1961)
          return color * vec3<f32>(1.2, 1.0, 0.8) + vec3<f32>(-0.05, 0.05, 0.15);
        }
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

      if (coord.x >= dimensions.x || coord.y >= dimensions.y) {
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

      // Apply film grain
      let grain = (rand(vec2<f32>(coord)) - 0.5) * params.grain;
      color += vec3<f32>(grain);

      // Ensure color values are within [0, 1] range
      color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

      textureStore(output_texture, coord, vec4<f32>(color, 1.0));
    }
  `,
}
