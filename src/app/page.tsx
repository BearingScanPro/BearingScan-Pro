'use client';

import { useState } from 'react';
import { inspectBearing } from '@/ai/flows/inspect-bearing';
import type { InspectionResult } from '@/types';
import Header from '@/components/header';
import ImageUploader from '@/components/image-uploader';
import InspectionResultDisplay from '@/components/inspection-result';
import DetectionLog from '@/components/detection-log';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [inspectionHistory, setInspectionHistory] = useState<InspectionResult[]>([]);
  const [currentInspection, setCurrentInspection] = useState<InspectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setCurrentInspection(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const imageUri = reader.result as string;
        const timestamp = new Date().toISOString();

        const aiResponse = await inspectBearing({ imageUri });

        const inspection: InspectionResult = {
          id: `ins_${Date.now()}`,
          image: imageUri,
          result: aiResponse.result,
          defectType: aiResponse.defectType,
          confidence: aiResponse.confidence,
          boundingBox: aiResponse.boundingBox,
          description: aiResponse.description,
          timestamp,
        };
        
        setCurrentInspection(inspection);
        setInspectionHistory(prev => [inspection, ...prev]);

      } catch (error) {
        console.error("Inspection failed:", error);
        toast({
          variant: "destructive",
          title: "Inspection Failed",
          description: "There was an error processing the image. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error("File reading error:", error);
      toast({
          variant: "destructive",
          title: "File Error",
          description: "Could not read the uploaded file.",
        });
      setIsLoading(false);
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col space-y-6">
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 h-full min-h-[300px] rounded-lg border-2 border-dashed border-border bg-card">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-base text-muted-foreground font-semibold">Analyzing Image...</p>
          </div>
        )}
        
        {currentInspection && <InspectionResultDisplay inspection={currentInspection} />}
        
        <div className="flex-grow min-h-[400px]">
          <DetectionLog history={inspectionHistory} />
        </div>
      </main>
    </div>
  );
}
