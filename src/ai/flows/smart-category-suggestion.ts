'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant conversion categories based on user input and past conversions.
 *
 * - suggestCategory - A function that takes user input and conversion history to suggest relevant categories.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 * - SuggestCategoryOutput - The return type for the suggestCategory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { conversionCategories } from '@/lib/conversions';

const categoryNames = conversionCategories.map(c => c.name);

const SuggestCategoryInputSchema = z.object({
  input: z.string().describe('The user input value or description.'),
  conversionHistory: z
    .array(z.string())
    .describe(
      'An array of strings representing the users recent conversion history.'
    )
    .optional(),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const SuggestCategoryOutputSchema = z.object({
  suggestedCategories: z
    .array(z.enum(categoryNames as [string, ...string[]]))
    .describe(
      'An array of suggested conversion categories based on the input and history.'
    ),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(
  input: SuggestCategoryInput
): Promise<SuggestCategoryOutput> {
  return suggestCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: { schema: SuggestCategoryInputSchema },
  output: { schema: SuggestCategoryOutputSchema },
  prompt: `You are a helpful assistant designed to suggest relevant conversion categories to the user.

  Based on the user's input value, determine the most likely type of unit they are trying to convert.
  For example, if the user enters "365", it could be 'Time'. If they enter "1024", it could be 'Data Storage'.

  Also consider the user's recent conversion history for context.

  Available categories: ${categoryNames.join(', ')}

  User input:
  {{input}}

  Recent conversion history:
  {{#if conversionHistory}}
    {{#each conversionHistory}}- {{this}}
    {{/each}}
  {{else}}
    No recent conversion history.
  {{/if}}

  Suggest a list of the 3 most relevant conversion categories from the available list.
  Return the categories as an array of strings.
  `,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
