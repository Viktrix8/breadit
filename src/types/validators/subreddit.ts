import { z } from "zod";

export const SubredditValidator = z.object({
  title: z.string().min(3).max(21),
});

export type CreateSubredditRequest = z.infer<typeof SubredditValidator>;
