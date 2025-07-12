export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type InspectionResult = {
  id: string;
  image: string; // base64 data URI
  result: 'Normal' | 'Defective';
  defectType?: string;
  confidence?: number;
  boundingBox?: BoundingBox;
  description?: string;
  timestamp: string;
};
