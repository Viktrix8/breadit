import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { VoteValidator } from "@/types/validators/vote";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const body = await req.json();
    const { postId, type } = VoteValidator.parse(body);

    const vote = await prisma.vote.findFirst({
      where: {
        postId: postId,
        userId: session.user.id,
      },
    });

    if (vote) {
      if (vote.type === type) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId: postId,
            },
          },
        });
      } else {
        await prisma.vote.update({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId: postId,
            },
          },
          data: {
            type: type,
          },
        });
      }
    } else {
      await prisma.vote.create({
        data: {
          type: type,
          postId: postId,
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
