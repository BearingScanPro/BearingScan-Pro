'use client';

import Image from 'next/image';
import type { InspectionResult } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface DetectionLogProps {
  history: InspectionResult[];
}

export default function DetectionLog({ history }: DetectionLogProps) {
  
  const getBadgeInfo = (result: InspectionResult['result']) => {
    switch(result) {
      case 'Defective':
        return { variant: 'destructive', icon: <XCircle className="mr-1 h-3 w-3" /> };
      case 'Not a bearing':
        return { variant: 'destructive', icon: <AlertTriangle className="mr-1 h-3 w-3" /> };
      case 'Normal':
      default:
        return { variant: 'default', icon: <CheckCircle2 className="mr-1 h-3 w-3" /> };
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Detection Log</CardTitle>
        <CardDescription>
          A history of all your recent inspections.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead className="w-[120px]">Result</TableHead>
                <TableHead className="w-[120px]">Confidence</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[120px] text-right">Defect Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                    No inspections yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => {
                  const badgeInfo = getBadgeInfo(item.result);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/50">
                          <Image
                            src={item.image}
                            alt="Inspection thumbnail"
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={badgeInfo.variant as any}
                        >
                          {badgeInfo.icon}
                          {item.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.defectType || 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
