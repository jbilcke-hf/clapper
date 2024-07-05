import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ClapTrack } from '@aitube/clap';

import { RuntimeSegment } from '@/types';

type WaveformVariant = 'stereo' | 'mono' | 'compact';

type WaveformProps = {
  segment: RuntimeSegment;
  track: ClapTrack;
  cellWidth: number;
  cellHeight: number;
  durationInSteps: number;
  opacity?: number;
  color?: string;
  variant?: WaveformVariant;
  lineSpacing?: number;
  thickness?: number;
  topOrBottomFillOpacity?: number;
  middleFillOpacity?: number;
};

export const Waveform: React.FC<WaveformProps> = ({
  segment,
  track,
  cellWidth,
  cellHeight,
  durationInSteps,
  opacity = 1,
  color = '#ffffff',
  variant = 'mono',
  lineSpacing = 0,
  thickness = 1,
  topOrBottomFillOpacity = 0.2,
  middleFillOpacity = 0.8
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const width = durationInSteps * cellWidth;
  const height = cellHeight;

  const getWaveformTexture = useMemo(() => {
    return (audioBuffer: AudioBuffer, width: number, height: number): THREE.Texture => {
      if (!segment.textures) {
        segment.textures = {};
      }
      
      const cacheKey = `waveform_${width}_${height}_${color}_${variant}_${lineSpacing}_${thickness}_${topOrBottomFillOpacity}_${middleFillOpacity}`;
      
      if (segment.textures[cacheKey]) {
        return segment.textures[cacheKey];
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const drawChannel = (channelData: Float32Array, yOffset: number, channelHeight: number) => {
        const step = Math.ceil(channelData.length / width);

        for (let i = 0; i < width; i++) {
          if (i % (lineSpacing + 1) !== 0) continue;

          let max = -1.0;
          for (let j = 0; j < step; j++) {
            const datum = channelData[(i * step) + j];
            if (datum > max) max = datum;
          }

          const x = i;
          // Only draw the positive part (top half) of the waveform
          const y = yOffset + channelHeight;
          const h = Math.max(1, max * channelHeight);

          // Create gradient from bottom to top
          const gradient = ctx.createLinearGradient(x, y - h, x, y);
          gradient.addColorStop(0, `${color}${Math.round(middleFillOpacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${color}${Math.round(topOrBottomFillOpacity * 255).toString(16).padStart(2, '0')}`);

          // Fill
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y - h, 1, h);

          // Stroke
          if (thickness > 0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = thickness;
            ctx.strokeRect(x, y - h, 1, h);
          }
        }
      };

      switch (variant) {
        case 'stereo':
          drawChannel(audioBuffer.getChannelData(0), 0, height / 2);
          if (audioBuffer.numberOfChannels > 1) {
            drawChannel(audioBuffer.getChannelData(1), height / 2, height / 2);
          }
          break;
        case 'mono':
        case 'compact':
          drawChannel(audioBuffer.getChannelData(0), 0, height);
          break;
      }

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      segment.textures[cacheKey] = texture;
      return texture;
    };
  }, [color, variant, lineSpacing, thickness, topOrBottomFillOpacity, middleFillOpacity]);

  useEffect(() => {
    if (meshRef.current && segment.assetUrl) {
      fetch(segment.assetUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          return audioContext.decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {
          const texture = getWaveformTexture(audioBuffer, width, height);
          if (meshRef.current) {
            (meshRef.current.material as THREE.MeshBasicMaterial).map = texture;
            (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
          }
        })
        .catch(error => console.error('Error loading audio:', error));
    }
  }, [segment.assetUrl, width, height, getWaveformTexture, gl]);

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 1]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent opacity={opacity * (track.visible ? 1 : 0.5)} />
    </mesh>
  );
};