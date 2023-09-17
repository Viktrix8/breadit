import { z } from "zod";

export const PostValidator = z.object({
  title: z.string().min(1).max(50),
  content: z.string(),
  subredditName: z.string(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
