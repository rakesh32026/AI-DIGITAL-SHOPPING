import React, { useState, useRef, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

interface CameraMeasurementProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (measurements: MeasurementData) => void;
}

export interface MeasurementData {
  height: string;
  chest: string;
  waist: string;
  hips: string;
  shoulders: string;
  inseam: string;
  size: string;
  photo: string;
}

const CameraMeasurement: React.FC<CameraMeasurementProps> = ({ isOpen, onClose, onCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Unable to access camera. Please ensure camera permissions are enabled.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = (): string => {
    if (!videoRef.current || !canvasRef.current) return '';
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return '';
  };

  const calculateSize = (chest: number, waist: number): string => {
    const avg = (chest + waist) / 2;
    if (avg < 85) return 'XS';
    if (avg < 92) return 'S';
    if (avg < 100) return 'M';
    if (avg < 108) return 'L';
    if (avg < 116) return 'XL';
    return 'XXL';
  };

  const handleCapture = () => {
    setIsCapturing(true);
    
    // Capture the photo first
    const photo = capturePhoto();
    
    // Simulate AI measurement processing with consistent values
    setTimeout(() => {
      // These would come from actual AI body measurement in production
      const height = 172;
      const chest = 95;
      const waist = 78;
      const hips = 96;
      const shoulders = 45;
      const inseam = 80;
      
      const measurements: MeasurementData = {
        height: `${height} cm`,
        chest: `${chest} cm`,
        waist: `${waist} cm`,
        hips: `${hips} cm`,
        shoulders: `${shoulders} cm`,
        inseam: `${inseam} cm`,
        size: calculateSize(chest, waist),
        photo,
      };
      
      onCapture(measurements);
      setIsCapturing(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Hidden canvas for capturing photo */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Position yourself in frame</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-background overflow-hidden">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Positioning Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <p className="absolute -top-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm whitespace-nowrap">
                  Stand here
                </p>
                <div className="w-48 h-80 border-2 border-dashed border-primary/60 rounded-lg" />
              </div>
            </div>

            {/* Capture Overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-foreground font-medium">Analyzing measurements...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-card border-t border-border flex justify-center">
        <button
          onClick={handleCapture}
          disabled={isCapturing || !!cameraError}
          className="w-16 h-16 rounded-full border-4 border-foreground/20 bg-card flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-foreground/10 border-2 border-foreground/30" />
        </button>
      </div>
    </div>
  );
};

export default CameraMeasurement;
