import { getAuthSession } from "@/lib/auth";
import { CommentValidator } from "@/types/validators/comment";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const body = await req.json();
    const { postId, content } = CommentValidator.parse(body);

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) return new Response("Post doesn't exist.", { status: 404 });

    await prisma.comment.create({
      data: {
        content,
        postId: post.id,
        authorId: session.user.id,
      },
    });

    return new Response("Comment created.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return new Response(errorMessages, { status: 400 });
    }

    return new Response("An unexpected error has occurred.", { status: 500 });
  }
};
