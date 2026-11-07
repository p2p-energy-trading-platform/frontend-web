import { z } from 'zod';

export const smartMeterClaimSchema = z.object({
  meterId: z
    .string()
    .trim()
    .min(1, 'Please enter a valid Smart Meter ID')
    .max(100),
});

export type SmartMeterClaimValues = z.infer<typeof smartMeterClaimSchema>;
