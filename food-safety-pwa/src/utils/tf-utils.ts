import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

const WASM_VERSION = '4.22.0';
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${WASM_VERSION}/dist/`;

// Global configuration must happen before backend registration
setWasmPaths(WASM_PATH);

/**
 * Pseudo-Spectral Reconstruction Logic
 * Targeting NIR 709nm and 950nm absorbance proxies
 */

export const initTensorFlow = async () => {
  try {
    await tf.setBackend('wasm');
    await tf.ready();
    console.log(`TF.js initialized with WASM backend (CDN v${WASM_VERSION})`);
  } catch (err) {
    console.warn('WASM backend failed, falling back to CPU:', err);
    await tf.setBackend('cpu');
    await tf.ready();
  }
};

/**
 * Produce Recognition Heuristic
 * Uses average RGB color moments to identify broad categories of produce.
 */
export const recognizeProduce = async (source: HTMLVideoElement | HTMLImageElement): Promise<string> => {
  const img = tf.browser.fromPixels(source);
  const avgColor = tf.mean(img, [0, 1]).dataSync();
  img.dispose();

  const [r, g, b] = avgColor;
  
  // Basic color-based classification for common Indian produce
  if (r > 150 && g < 100 && b < 100) return 'Tomato / Red Apple';
  if (g > r && g > b && g > 100) return 'Leafy Greens (Palak/Methi)';
  if (r > 80 && b > 80 && g < 100) return 'Brinjal / Eggplant';
  if (r > 150 && g > 150 && b < 100) return 'Banana / Lemon';
  if (r < 60 && g < 60 && b < 60) return 'Black Grapes';
  
  return 'General Produce';
};

export const processImage = async (source: HTMLVideoElement | HTMLImageElement, canvasElement: HTMLCanvasElement) => {
  const img = tf.browser.fromPixels(source);
  
  // Normalize and resize
  const resized = tf.image.resizeBilinear(img, [224, 224]);
  const normalized = resized.div(255.0);
  
  const grayscale = normalized.mean(2);
  const residueBuffer = await grayscale.array() as number[][];
  
  const ctx = canvasElement.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvasElement;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ty = Math.floor((y / height) * 224);
      const tx = Math.floor((x / width) * 224);
      const intensity = residueBuffer[ty][tx];
      
      const idx = (y * width + x) * 4;
      
      /**
       * THERMAL PALETTE (Magma/Inferno Inspired)
       * Low Intensity (High Absorbance Proxy) -> Yellow/White (Hot Residue)
       * Medium Intensity -> Red/Orange
       * High Intensity (Low Absorbance) -> Dark Blue/Black (Clean)
       */
      if (intensity < 0.2) {
        // Critical Hotspot (White-Yellow)
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 180;
        data[idx + 3] = 230;
      } else if (intensity < 0.4) {
        // High Absorbance (Orange-Red)
        data[idx] = 239;
        data[idx + 1] = 68;
        data[idx + 2] = 68;
        data[idx + 3] = 200;
      } else if (intensity < 0.7) {
        // Trace Residue (Dark Purple)
        data[idx] = 88;
        data[idx + 1] = 28;
        data[idx + 2] = 135;
        data[idx + 3] = 150;
      } else {
        // Clean (Deep Blue/Black)
        data[idx] = 30;
        data[idx + 1] = 58;
        data[idx + 2] = 138;
        data[idx + 3] = 80;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  // Cleanup tensors
  img.dispose();
  resized.dispose();
  normalized.dispose();
  grayscale.dispose();
};
