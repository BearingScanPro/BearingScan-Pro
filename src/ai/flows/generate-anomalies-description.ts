// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates a text description of why a specific defect was detected.
 *
 * - generateAnomaliesDescription - A function that handles the generation of the defect description.
 * - GenerateAnomaliesDescriptionInput - The input type for the generateAnomaliesDescription function.
 * - GenerateAnomaliesDescriptionOutput - The return type for the generateAnomaliesDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnomaliesDescriptionInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of the packaged product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  defectType: z.string().describe('The type of defect detected.'),
  confidenceScore: z.number().describe('The confidence score of the defect detection (0-1).'),
});
export type GenerateAnomaliesDescriptionInput = z.infer<typeof GenerateAnomaliesDescriptionInputSchema>;

const GenerateAnomaliesDescriptionOutputSchema = z.object({
  description: z.string().describe('A text description of why the defect was detected.'),
});
export type GenerateAnomaliesDescriptionOutput = z.infer<typeof GenerateAnomaliesDescriptionOutputSchema>;

export async function generateAnomaliesDescription(input: GenerateAnomaliesDescriptionInput): Promise<GenerateAnomaliesDescriptionOutput> {
  return generateAnomaliesDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnomaliesDescriptionPrompt',
  input: {schema: GenerateAnomaliesDescriptionInputSchema},
  output: {schema: GenerateAnomaliesDescriptionOutputSchema},
  prompt: `You are an AI expert in detecting defects in packaged products on a production line.

  Given an image of a packaged product, the type of defect detected, and the confidence score of the detection, generate a text description of why the defect was detected.
  Be concise, but descriptive.

  Image: {{media url=imageUri}}
  Defect Type: {{{defectType}}}
  Confidence Score: {{{confidenceScore}}}
  `,
});

const generateAnomaliesDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAnomaliesDescriptionFlow',
    inputSchema: GenerateAnomaliesDescriptionInputSchema,
    outputSchema: GenerateAnomaliesDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
