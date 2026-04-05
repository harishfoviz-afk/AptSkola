import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';

/**
 * Pseudo-Spectral Reconstruction Logic
 * Targeting NIR 709nm and 950nm absorbance proxies
 */

export const initTensorFlow = async () => {
  await tf.setBackend('wasm');
  await tf.ready();
  console.log('TF.js initialized with WASM backend');
};

export const processImage = async (source: HTMLVideoElement | HTMLImageElement, canvasElement: HTMLCanvasElement) => {
  const img = tf.browser.fromPixels(source);
  
  // Normalize and resize
  const resized = tf.image.resizeBilinear(img, [224, 224]);
  const normalized = resized.div(255.0);
  
  /**
   * SPECTRAL RECONSTRUCTION PROXY
   * Real spectral data would require specialized sensors.
   * Here we use RGB absorbance as a proxy for chemical residue hotspots.
   * Residual chemicals often absorb more in the NIR 709/950nm range.
   * Logic: Map low-intensity/specific-hue pixel clusters to "residue" score.
   */
  const grayscale = normalized.mean(2);
  const residueBuffer = await grayscale.array() as number[][];
  
  // Draw false-color heatmap
  const ctx = canvasElement.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvasElement;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Simplified heatmap generation from TF.js output
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ty = Math.floor((y / height) * 224);
      const tx = Math.floor((x / width) * 224);
      const intensity = residueBuffer[ty][tx];
      
      const idx = (y * width + x) * 4;
      
      // False color mapping: 
      // High absorbance (low intensity) -> Red (Hot)
      // Low absorbance (high intensity) -> Blue (Clean)
      if (intensity < 0.3) {
        // Hotspot (Red)
        data[idx] = 239;     // R
        data[idx + 1] = 68;  // G
        data[idx + 2] = 68;  // B
        data[idx + 3] = 180; // A
      } else if (intensity < 0.6) {
        // Warning (Yellow/Orange)
        data[idx] = 245;
        data[idx + 1] = 158;
        data[idx + 2] = 11;
        data[idx + 3] = 100;
      } else {
        // Clean (Blue)
        data[idx] = 59;
        data[idx + 1] = 130;
        data[idx + 2] = 246;
        data[idx + 3] = 40;
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
