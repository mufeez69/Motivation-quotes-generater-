// src/ai/flows/generate-motivational-quote.ts
'use server';

/**
 * @fileOverview Generates a motivational quote using a generative AI tool.
 *
 * - generateMotivationalQuote - A function that generates a motivational quote.
 * - GenerateMotivationalQuoteInput - The input type for the generateMotivationalQuote function.
 * - GenerateMotivationalQuoteOutput - The return type for the generateMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationalQuoteInputSchema = z.object({
  theme: z
    .string()
    .optional()
    .describe('The theme of the motivational quote.'),
  style: z
    .string()
    .optional()
    .describe('The style of the motivational quote.'),
});
export type GenerateMotivationalQuoteInput = z.infer<
  typeof GenerateMotivationalQuoteInputSchema
>;

const GenerateMotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe('The generated motivational quote.'),
});
export type GenerateMotivationalQuoteOutput = z.infer<
  typeof GenerateMotivationalQuoteOutputSchema
>;

export async function generateMotivationalQuote(
  input: GenerateMotivationalQuoteInput
): Promise<GenerateMotivationalQuoteOutput> {
  return generateMotivationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationalQuotePrompt',
  input: {schema: GenerateMotivationalQuoteInputSchema},
  output: {schema: GenerateMotivationalQuoteOutputSchema},
  prompt: `You are a motivational quote generator. Generate a quote based on the following theme and style.
Theme: {{{theme}}}
Style: {{{style}}}

Quote:`,
});

const generateMotivationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateMotivationalQuoteFlow',
    inputSchema: GenerateMotivationalQuoteInputSchema,
    outputSchema: GenerateMotivationalQuoteOutputSchema,
  },
  async (input) => {
    let retries = 3;
    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error) {
        console.error(`Attempt failed: ${error}`);
        retries--;
        if (retries === 0) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Failed to generate quote after multiple retries.');
  }
);
