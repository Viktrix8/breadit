import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { SubscriptionValidator } from "@/types/validators/subscription";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const data = await req.json();

    const { subredditId } = SubscriptionValidator.parse(data);

    const subredditExists = await prisma.subreddit.findFirst({
      where: {
        id: subredditId,
      },
    });

    if (!subredditExists)
      return new Response("Subreddit doesn't exist.", { status: 404 });

    if (subredditExists.authorId === session.user.id)
      return new Response("You can't subscribe to your own subreddit.", {
        status: 403,
      });

    const subscription = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (subscription) {
      await prisma.subscription.delete({
        where: {
          userId_subredditId: {
            subredditId,
            userId: session.user.id,
          },
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          subredditId,
          userId: session.user.id,
        },
      });
    }

    return new Response("Success.", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return new Response(errorMessages, { status: 400 });
    }
    console.log(error);
    return new Response("An unexpected error has occurred.", { status: 500 });
  }
};
