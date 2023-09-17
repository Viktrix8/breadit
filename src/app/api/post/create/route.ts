import { getAuthSession } from "@/lib/auth";
import { PostValidator } from "@/types/validators/post";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const POST = async (req: Request) => {
  const session = await getAuthSession();

  if (!session) return new Response("Not authorized.", { status: 401 });
  try {
    const body = await req.json();
    const { subredditName, title, content } = PostValidator.parse(body);

    const subreddit = await prisma.subreddit.findFirst({
      where: {
        title: subredditName,
      },
    });

    if (!subreddit)
      return new Response("Subreddit doesn't exist.", { status: 404 });

    const post = await prisma.post.create({
      data: {
        content,
        title,
        subredditId: subreddit.id,
      },
    });

    return new Response(post.id, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return new Response(errorMessages, { status: 400 });
    }
    console.log(error);
    return new Response("An unexpected error has occurred.", { status: 500 });
  }
};
