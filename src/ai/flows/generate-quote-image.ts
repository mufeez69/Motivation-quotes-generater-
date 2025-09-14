'use server';
/**
 * @fileOverview Generates an image with a motivational quote.
 *
 * - generateQuoteImage - A function that generates an image with a quote.
 * - GenerateQuoteImageInput - The input type for the generateQuoteImage function.
 * - GenerateQuoteImageOutput - The return type for the generateQuoteImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateQuoteImageInputSchema = z.object({
  quote: z.string().describe('The motivational quote to put on the image.'),
});
export type GenerateQuoteImageInput = z.infer<
  typeof GenerateQuoteImageInputSchema
>;

const GenerateQuoteImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The data URI of the generated image with the quote.'),
});
export type GenerateQuoteImageOutput = z.infer<
  typeof GenerateQuoteImageOutputSchema
>;

export async function generateQuoteImage(
  input: GenerateQuoteImageInput
): Promise<GenerateQuoteImageOutput> {
  return generateQuoteImageFlow(input);
}

const generateQuoteImageFlow = ai.defineFlow(
  {
    name: 'generateQuoteImageFlow',
    inputSchema: GenerateQuoteImageInputSchema,
    outputSchema: GenerateQuoteImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: `Generate a visually stunning, artistic, and inspiring image that complements the following motivational quote. The quote should be elegantly integrated into the image, with a clear, readable, and stylish font. The overall composition should be powerful and shareable on social media.

Quote: "${input.quote}"

Image style guidelines:
- Abstract, symbolic, or metaphorical visuals are preferred over literal interpretations.
- Use a rich, cinematic color palette.
- Ensure high contrast for readability of the text.
- The final image should feel premium and highly polished.`,
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a valid URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
