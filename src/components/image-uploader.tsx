'use client';

import { useRef, useState, type DragEvent, useEffect } from 'react';
import { Camera, ImageUp, Loader2, CircleDot, SwitchCamera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };
      getCameraPermission();
    }
    
    return () => {
      // Stop camera stream when dialog is closed or component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const mediaStream = videoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraOpen, facingMode, toast]);

  const handleFileSelect = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid image file (e.g., PNG, JPG).",
        });
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onImageUpload(file);
            setIsCameraOpen(false);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleCameraSwitch = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline">Start Inspection</CardTitle>
          <CardDescription>Upload or capture an image to begin analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-primary bg-accent/20' : 'border-border hover:border-primary/50'}`}
            onDragEnter={onDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <ImageUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              <span className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or WEBP</p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
            onClick={() => setIsCameraOpen(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-2 h-5 w-5" />
            )}
            Capture from Camera
          </Button>
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} className="hidden" />

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Camera Capture</DialogTitle>
            <DialogDescription>
              Center the object within the circle and click capture.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <video ref={videoRef} className="w-full aspect-square rounded-md object-cover" autoPlay muted playsInline />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-4/5 h-4/5 rounded-full border-4 border-white/50"
                style={{
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
              />
            </div>
             <Button
                variant="outline"
                size="icon"
                onClick={handleCameraSwitch}
                className="absolute bottom-4 right-4 rounded-full bg-black/50 hover:bg-black/70 border-white/50 text-white"
                disabled={!hasCameraPermission}
              >
                <SwitchCamera className="h-5 w-5" />
              </Button>
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <Alert variant="destructive" className="m-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                  </AlertDescription>
                </Alert>
              </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                   <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            )}
          </div>
          <DialogFooter className="p-4 pt-0">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCapture} disabled={!hasCameraPermission}>
              <CircleDot className="mr-2"/>
              Capture & Analyze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
