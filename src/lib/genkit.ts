import { flow, run, z } from '@genkit-ai/core';

/**
 * Genkit Flow for automatic vehicle verification.
 * Constraints: Mileage < 60k and Photos >= 20.
 */
export const autoVerifyListing = flow(
  {
    name: 'autoVerifyListing',
    inputSchema: z.object({
      mileage: z.number(),
      images: z.array(z.string()),
    }),
    outputSchema: z.object({
      status: z.enum(['verified', 'rejected']),
      reason: z.string().optional(),
    }),
  },
  async (input) => {
    const { mileage, images } = input;
    
    if (mileage < 60000 && images.length >= 20) {
      return { status: 'verified' as const, reason: 'Meets premium marketplace criteria.' };
    }
    
    let reason = '';
    if (mileage >= 60000) reason += 'High mileage for elite status. ';
    if (images.length < 20) reason += 'Insufficient photos for verification. ';
    
    return { status: 'rejected' as const, reason: reason.trim() };
  }
);
