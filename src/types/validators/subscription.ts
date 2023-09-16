import { z } from "zod";

export const SubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type SubscriptionRequest = z.infer<typeof SubscriptionValidator>;
