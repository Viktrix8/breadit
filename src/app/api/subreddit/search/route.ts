import { prisma } from "@/lib/db";

export const GET = async (req: Request) => {
  try {
    const query = req.url.split("q=")[1];

    if (!query) return new Response("No query param defined.", { status: 400 });

    const subreddits = await prisma.subreddit.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 10,
      select: {
        title: true,
      },
    });

    return new Response(JSON.stringify(subreddits));
  } catch (error) {
    return new Response("Unexpected error occured, please try again.", {
      status: 500,
    });
  }
};
