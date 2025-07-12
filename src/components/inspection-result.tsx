'use client';

import Image from 'next/image';
import type { InspectionResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';

interface InspectionResultDisplayProps {
  inspection: InspectionResult;
}

export default function InspectionResultDisplay({ inspection }: InspectionResultDisplayProps) {
  const isDefective = inspection.result === 'Defective';
  const isNormal = inspection.result === 'Normal';
  const isNotBearing = inspection.result === 'Not a bearing';

  const getBadgeVariant = () => {
    if (isDefective || isNotBearing) return 'destructive';
    return 'default';
  }

  const getBadgeIcon = () => {
    if(isNotBearing) return <AlertTriangle className="mr-2 h-4 w-4" />;
    if(isDefective) return <XCircle className="mr-2 h-4 w-4" />;
    return <CheckCircle2 className="mr-2 h-4 w-4" />;
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Inspection Result</span>
          <Badge variant={getBadgeVariant()} className="text-base">
            {getBadgeIcon()}
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

        {isNotBearing && (
           <Card className="bg-destructive/10 border-destructive">
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0 pb-2">
                <AlertTriangle className="h-5 w-5 text-destructive"/>
                <CardTitle className="text-base font-headline text-destructive">Object Not Recognized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive/80">
                The uploaded image was not identified as an industrial bearing. Please upload a clear image of a bearing for analysis.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
