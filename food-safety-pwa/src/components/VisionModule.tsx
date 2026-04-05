import React, { useRef, useEffect, useState } from 'react';
import { initTensorFlow, processImage } from '../utils/tf-utils';
import { AlertTriangle, Home, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface VisionModuleProps {
  onScanComplete: (score: number, produceType: string) => void;
  onCancel: () => void;
}

const VisionModule: React.FC<VisionModuleProps> = ({ onScanComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const scanSteps = [
    "Optic Initialization...",
    "Spectral Sampling (709nm)...",
    "NIR Absorbance Mapping...",
    "Chemical Residue Proxying...",
    "Finalizing Safety Score..."
  ];

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        await initTensorFlow();
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsInitializing(false);
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Please allow camera access to scan produce.');
        setIsInitializing(false);
      }
    };

    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    await processImage(videoRef.current, canvasRef.current);
    
    setTimeout(() => {
      setIsProcessing(false);
      onScanComplete(78, 'Tomato');
    }, 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvasRef.current) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        if (canvasRef.current) {
          await processImage(img, canvasRef.current);
          setTimeout(() => {
            setIsProcessing(false);
            onScanComplete(82, 'Gallery Item');
          }, 3000);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {isInitializing && (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="animate-spin text-emerald-400" size={32} />
            <p className="text-emerald-100/60 text-sm">Initializing Optics...</p>
          </div>
        )}
        
        {error && (
          <div className="p-8 text-center space-y-4">
            <AlertTriangle className="mx-auto text-amber-500" size={48} />
            <p className="text-white font-medium">{error}</p>
            <button 
              onClick={onCancel}
              className="px-6 py-2 bg-neutral-800 rounded-full text-sm"
            >
              Go Back
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isInitializing ? 'opacity-0' : 'opacity-100'}`}
        />
        
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60 mix-blend-screen transition-opacity duration-1000 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}
          width={448}
          height={448}
        />

        {/* HUD UI */}
        {!isInitializing && !error && (
          <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20">
             <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-emerald-900/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-500/30 w-[80%] max-w-xs text-center transition-all">
               <span className="text-[10px] font-bold text-emerald-100 tracking-widest uppercase block animate-pulse">
                {isProcessing ? scanSteps[processingStep] : "Spectral Analysis Active"}
               </span>
             </div>

             <div className={`absolute inset-x-12 top-1/2 -translate-y-1/2 aspect-square border border-emerald-500/20 rounded-2xl transition-all duration-500 ${isProcessing ? 'scale-110 border-emerald-400' : 'scale-100'}`}>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-emerald-500/10 animate-pulse overflow-hidden rounded-2xl">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-0 animate-[scan_2s_linear_infinite]" />
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-10 pb-16 bg-gradient-to-t from-black to-transparent flex justify-between items-center px-12">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-emerald-400 active:scale-90 shadow-lg border border-emerald-500/20"
        >
          <ImageIcon size={24} />
        </button>
        
        <button 
          onClick={handleCapture}
          disabled={isInitializing || isProcessing}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative active:scale-95 transition-transform"
        >
          <div className={`w-16 h-16 rounded-full bg-white transition-all ${isProcessing ? 'scale-75 opacity-50' : 'scale-100'}`} />
          {isProcessing && <RefreshCw className="absolute animate-spin text-emerald-600" size={32} />}
        </button>

        <button 
          onClick={onCancel}
          className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 active:scale-90"
        >
          <Home size={24} />
        </button>
      </div>
    </div>
  );
};

export default VisionModule;
