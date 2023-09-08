import { getAuthSession } from "@/lib/auth";
import { SubredditValidator } from "@/types/validators/subreddit";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const data = await req.json();

    const { title } = SubredditValidator.parse(data);

    const subredditExists = await prisma.subreddit.findFirst({
      where: {
        title,
      },
    });

    if (subredditExists) return new Response("Invalid name.", { status: 409 });

    const subreddit = await prisma.subreddit.create({
      data: {
        title,
      },
    });

    return new Response(subreddit.id, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return new Response(errorMessages, { status: 400 });
    }
    console.log(error);
    return new Response("An unexpected error has occurred.", { status: 500 });
  }
};
