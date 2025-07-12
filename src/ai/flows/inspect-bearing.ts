'use server';

/**
 * @fileOverview An AI flow to inspect industrial bearings for defects.
 *
 * - inspectBearing - A function that handles the bearing inspection process.
 * - InspectBearingInput - The input type for the inspectBearing function.
 * - InspectBearingOutput - The return type for the inspectBearing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { BoundingBox } from '@/types';

const BoundingBoxSchema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
});

const InspectBearingInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InspectBearingInput = z.infer<typeof InspectBearingInputSchema>;

const InspectBearingOutputSchema = z.object({
    isBearing: z.boolean().describe('Whether or not the image contains an industrial bearing.'),
    result: z.enum(['Normal', 'Defective', 'Not a bearing']).describe("The result of the inspection. If isBearing is false, this must be 'Not a bearing'."),
    defectType: z.string().optional().describe('The type of defect detected, if any.'),
    confidence: z.number().optional().describe('The confidence score of the defect detection (0-1).'),
    boundingBox: BoundingBoxSchema.optional().describe('The bounding box of the defect.'),
    description: z.string().optional().describe('A text description of why the defect was detected.'),
});
export type InspectBearingOutput = z.infer<typeof InspectBearingOutputSchema>;


export async function inspectBearing(input: InspectBearingInput): Promise<InspectBearingOutput> {
  return inspectBearingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inspectBearingPrompt',
  input: {schema: InspectBearingInputSchema},
  output: {schema: InspectBearingOutputSchema},
  prompt: `You are an AI expert in identifying industrial bearings and detecting defects in them from images.

  Your task is to analyze the provided image.

  1. First, determine if the image contains an industrial bearing. Set the 'isBearing' field accordingly.
  2. If it is not a bearing, set the 'result' to 'Not a bearing' and leave the other fields empty.
  3. If it IS a bearing, determine if it is 'Normal' or 'Defective'.
  4. If it is 'Defective', identify the 'defectType' (e.g., 'Corrosion', 'Spalling', 'Crack', 'Discoloration'), estimate a 'confidence' score, provide a 'boundingBox' for the defect, and generate a 'description' of the issue.
  5. If it is 'Normal', set the result and leave the other defect-related fields empty.

  Image: {{media url=imageUri}}
  `,
});

const inspectBearingFlow = ai.defineFlow(
  {
    name: 'inspectBearingFlow',
    inputSchema: InspectBearingInputSchema,
    outputSchema: InspectBearingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
