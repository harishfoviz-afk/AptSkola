import React, { useRef, useEffect, useState } from 'react';
import { initTensorFlow, processImage, recognizeProduce } from '../utils/tf-utils';
import { AlertTriangle, Home, RefreshCw, Image as ImageIcon, Camera } from 'lucide-react';

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
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanSteps = [
    "Optic Initialization...",
    "Spectral Sampling (709nm)...",
    "NIR Absorbance Mapping...",
    "Chemical Residue Proxying...",
    "Finalizing Safety Score..."
  ];

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    let interval: number;
    if (isProcessing) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 500);
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

    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    // Recognition & Spectral Processing
    const type = await recognizeProduce(videoRef.current);
    setDetectedType(type);
    await processImage(videoRef.current, canvasRef.current);
    
    // RESTRICT CAMERA ACCESS after capture
    stopCamera();
    
    // Finalizing delay for HUD effect
    setTimeout(() => {
      setIsProcessing(false);
      onScanComplete(78, type);
    }, 2800);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvasRef.current) return;

    setIsProcessing(true);
    // Ensure camera is off when upload starts
    stopCamera();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        if (canvasRef.current) {
          const type = await recognizeProduce(img);
          setDetectedType(type);
          await processImage(img, canvasRef.current);
          
          setTimeout(() => {
            setIsProcessing(false);
            onScanComplete(82, type);
          }, 2800);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

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

        {/* Video feed (hidden when off) */}
        {videoRef.current?.srcObject && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isInitializing ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
        
        {/* Spectral Heatmap Canvas - Highly Visible Thermal Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${isProcessing ? 'opacity-90' : 'opacity-0'} mix-blend-color-dodge`}
          width={448}
          height={448}
        />

        {/* HUD UI */}
        {!isInitializing && !error && (
          <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20">
             <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-emerald-900/60 backdrop-blur-md px-6 py-2 rounded-full border border-emerald-500/30 w-[85%] max-w-sm text-center transition-all">
               <span className="text-[11px] font-bold text-emerald-100 tracking-widest uppercase block animate-pulse">
                {isProcessing ? scanSteps[processingStep] : "Spectral Analysis Active"}
               </span>
               {detectedType && isProcessing && (
                 <span className="text-[10px] text-emerald-400/80 font-medium lowercase">
                   target: {detectedType}
                 </span>
               )}
             </div>

             <div className={`absolute inset-x-12 top-1/2 -translate-y-1/2 aspect-square border border-emerald-500/40 rounded-2xl transition-all duration-700 ${isProcessing ? 'scale-110 border-white/40' : 'scale-100'}`}>
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-emerald-500/5 animate-pulse overflow-hidden rounded-2xl">
                    <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 animate-[scan_2.5s_linear_infinite]" />
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
          className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-emerald-400 active:scale-90 shadow-2xl border border-emerald-500/20"
        >
          <ImageIcon size={28} />
        </button>
        
        <button 
          onClick={handleCapture}
          disabled={isInitializing || isProcessing || !videoRef.current?.srcObject}
          className="w-24 h-24 rounded-full border-4 border-white/80 flex items-center justify-center relative active:scale-95 transition-transform bg-white/5 backdrop-blur-sm"
        >
          <div className={`w-18 h-18 rounded-full bg-white transition-all ${isProcessing ? 'scale-75 opacity-30' : 'scale-100'}`} />
          {isProcessing ? (
            <RefreshCw className="absolute animate-spin text-emerald-600" size={36} />
          ) : !videoRef.current?.srcObject ? (
            <Camera className="absolute text-neutral-600 opacity-20" size={32} />
          ) : null}
        </button>

        <button 
          onClick={onCancel}
          className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 active:scale-90"
        >
          <Home size={28} />
        </button>
      </div>
    </div>
  );
};

export default VisionModule;
