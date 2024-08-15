import { Filter } from '@aitube/clapper-services'

export const colorTemperature: Filter = {
  id: 'color_temperature_adjustment',
  label: 'Color Temperature Adjustment',
  parameters: [
    {
      id: 'temperature',
      label: 'Temperature',
      description: 'Color temperature in Kelvin',
      type: 'number',
      minValue: 1000,
      maxValue: 40000,
      defaultValue: 6500,
    },
    {
      id: 'tint',
      label: 'Tint',
      description: 'Green-Magenta tint',
      type: 'number',
      minValue: -100,
      maxValue: 100,
      defaultValue: 0,
    },
  ],
  shader: `
struct Params {
    temperature: f32,
    tint: f32,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var output_texture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> params: Params;
@group(0) @binding(3) var depth_texture: texture_2d<f32>;
@group(0) @binding(4) var texture_sampler: sampler;

fn rgb_to_xyz(rgb: vec3<f32>) -> vec3<f32> {
    let m = mat3x3<f32>(
        0.4124564, 0.3575761, 0.1804375,
        0.2126729, 0.7151522, 0.0721750,
        0.0193339, 0.1191920, 0.9503041
    );
    return m * rgb;
}

fn xyz_to_rgb(xyz: vec3<f32>) -> vec3<f32> {
    let m = mat3x3<f32>(
        3.2404542, -1.5371385, -0.4985314,
        -0.9692660, 1.8760108, 0.0415560,
        0.0556434, -0.2040259, 1.0572252
    );
    return m * xyz;
}

fn temperature_to_xyz(temperature: f32) -> vec3<f32> {
    let temp = temperature / 100.0;
    var x: f32;
    if (temp <= 66.0) {
        x = 0.3;
    } else {
        x = 0.3 + 0.06 * pow((temp - 66.0) / 100.0, 2.5);
    }
    
    var y: f32;
    if (temp <= 66.0) {
        y = 0.2 + 0.1 * log(temp) / log(66.0);
    } else {
        y = 0.3;
    }
    
    let z = 1.0 - x - y;
    return vec3<f32>(x, y, z);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let dimensions = textureDimensions(input_texture);
    let coord = vec2<i32>(global_id.xy);

    if (coord.x >= i32(dimensions.x) || coord.y >= i32(dimensions.y)) {
        return;
    }

    var color = textureLoad(input_texture, coord, 0).rgb;

    // Convert to XYZ color space
    var xyz = rgb_to_xyz(color);

    // Apply color temperature adjustment
    let target_xyz = temperature_to_xyz(params.temperature);
    let reference_xyz = temperature_to_xyz(6500.0); // Reference D65 white point
    xyz *= target_xyz / reference_xyz;

    // Apply tint (green-magenta balance)
    let tint_factor = 1.0 + params.tint / 100.0;
    xyz.y *= tint_factor;

    // Convert back to RGB
    color = xyz_to_rgb(xyz);

    // Ensure color values are within [0, 1] range
    color = clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));

    textureStore(output_texture, coord, vec4<f32>(color, 1.0));
}
  `,
}
