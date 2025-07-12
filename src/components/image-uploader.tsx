'use client';

import { useRef, useState, type DragEvent } from 'react';
import { Camera, ImageUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  return (
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
          onClick={() => cameraInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-5 w-5" />
          )}
          Capture from Camera
        </Button>
        <Input
          ref={cameraInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  );
}
