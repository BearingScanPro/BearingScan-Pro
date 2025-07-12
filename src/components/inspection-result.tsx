'use client';

import Image from 'next/image';
import type { InspectionResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

interface InspectionResultDisplayProps {
  inspection: InspectionResult;
}

export default function InspectionResultDisplay({ inspection }: InspectionResultDisplayProps) {
  const isDefective = inspection.result === 'Defective';

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Inspection Result</span>
          <Badge variant={isDefective ? 'destructive' : 'default'} className="text-base">
            {isDefective ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            {inspection.result}
          </Badge>
        </CardTitle>
        <CardDescription>
          Analyzed at {new Date(inspection.timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div data-ai-hint="product packaging" className="relative w-full aspect-[9/16] rounded-md overflow-hidden border border-border bg-muted/30">
          <Image src={inspection.image} alt="Inspected product" layout="fill" objectFit="contain" />
          {isDefective && inspection.boundingBox && (
            <div
              className="absolute border-4 border-destructive box-content animate-pulse"
              style={{
                left: `${inspection.boundingBox.x}%`,
                top: `${inspection.boundingBox.y}%`,
                width: `${inspection.boundingBox.width}%`,
                height: `${inspection.boundingBox.height}%`,
              }}
            />
          )}
        </div>
        
        {isDefective && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-semibold text-muted-foreground">Defect Type</p>
              <p className="font-bold text-foreground text-base">{inspection.defectType}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-semibold text-muted-foreground">Confidence</p>
              <p className="font-bold text-foreground text-base">
                {inspection.confidence && (inspection.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
        
        {inspection.description && (
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0 pb-2">
                <FileText className="h-5 w-5 text-primary"/>
                <CardTitle className="text-base font-headline">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">
                {inspection.description}
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
