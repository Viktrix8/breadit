import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { CommentVoteValidator } from "@/types/validators/vote";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const body = await req.json();
    const { commentId, type } = CommentVoteValidator.parse(body);

    const vote = await prisma.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (vote) {
      if (vote.type === type) {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });
      } else {
        await prisma.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type: type,
          },
        });
      }
    } else {
      await prisma.commentVote.create({
        data: {
          type: type,
          commentId,
          userId: session.user.id,
        },
      });
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return new Response(errorMessages, { status: 400 });
    }
    console.log(error);
    return new Response("An unexpected error has occurred.", { status: 500 });
  }
};
