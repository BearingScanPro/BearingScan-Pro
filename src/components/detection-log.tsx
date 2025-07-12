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
import { CheckCircle2, XCircle } from 'lucide-react';

interface DetectionLogProps {
  history: InspectionResult[];
}

export default function DetectionLog({ history }: DetectionLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Detection Log</CardTitle>
        <CardDescription>
          A history of all your recent inspections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Defect Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No inspections yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
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
                        variant={item.result === 'Defective' ? 'destructive' : 'default'}
                      >
                         {item.result === 'Defective' ? <XCircle className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
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
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
