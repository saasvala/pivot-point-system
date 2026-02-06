import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Keyboard, ScanBarcode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export const BarcodeScanner = ({ isOpen, onClose, onScan }: BarcodeScannerProps) => {
  const [mode, setMode] = useState<'camera' | 'manual'>('manual');
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError('Camera access denied or not available. Use manual entry.');
      setMode('manual');
    }
  }, []);

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode, startCamera, stopCamera]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setManualCode('');
      setMode('manual');
    }
  }, [isOpen, stopCamera]);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  // Simulate barcode detection from camera (real impl would use BarcodeDetector API or a library)
  const handleSimulateScan = () => {
    const fakeCodes = ['BEV001', 'BEV002', 'FOD001', 'ELC001', 'GRO001'];
    const code = fakeCodes[Math.floor(Math.random() * fakeCodes.length)];
    toast.success(`Scanned: ${code}`);
    onScan(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-card rounded-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <ScanBarcode className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Barcode Scanner</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mode Toggle */}
          <div className="p-4 border-b border-border/30">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === 'camera' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setMode('camera')}
              >
                <Camera className="w-4 h-4" />
                Camera
              </Button>
              <Button
                variant={mode === 'manual' ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => { setMode('manual'); stopCamera(); }}
              >
                <Keyboard className="w-4 h-4" />
                Manual Entry
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {mode === 'camera' ? (
              <div className="space-y-4">
                {cameraError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{cameraError}</p>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border-2 border-dashed border-primary/30">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-1/2 border-2 border-primary/60 rounded-lg">
                          <motion.div
                            className="w-full h-0.5 bg-primary/80"
                            animate={{ y: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Point camera at barcode
                    </p>
                    <Button variant="outline" className="w-full gap-2" onClick={handleSimulateScan}>
                      <Zap className="w-4 h-4" />
                      Simulate Scan (Demo)
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Enter barcode or SKU manually</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Scan or type SKU..."
                      value={manualCode}
                      onChange={e => setManualCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                      className="h-12 text-lg font-mono"
                      autoFocus
                    />
                    <Button className="h-12 px-5" onClick={handleManualSubmit}>
                      Search
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">💡 USB Scanner Tips</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>USB scanners work like keyboards — just scan!</li>
                    <li>Focus the search bar and scan directly</li>
                    <li>Most scanners auto-submit with Enter key</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
