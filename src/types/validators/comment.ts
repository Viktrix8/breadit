import { z } from "zod";

export const CommentValidator = z.object({
  content: z.string().min(1).max(125),
  postId: z.string(),
});

export type CommentCreationRequest = z.infer<typeof CommentValidator>;
