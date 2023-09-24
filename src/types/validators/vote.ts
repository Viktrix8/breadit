import { z } from "zod";

export const VoteValidator = z.object({
  type: z.enum(["UP", "DOWN"]),
  postId: z.string(),
});

export type VoteRequest = z.infer<typeof VoteValidator>;
