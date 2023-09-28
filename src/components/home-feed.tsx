import { prisma } from "@/lib/db";
import Feed from "./feed";
import { getAuthSession } from "@/lib/auth";

type Props = {};

export default async function HomeFeed({}: Props) {
  const session = await getAuthSession();

  const postsFromSubscribedSubreddits = await prisma.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    take: 10,
    select: {
      subreddit: {
        select: {
          Posts: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: true,
              subreddit: true,
              Comments: true,
              Votes: {
                include: {
                  user: true,
                }
              }
            },
          },
        },
      },
    },
  });

  const flattenedPosts = postsFromSubscribedSubreddits
    .flatMap((subscription) => subscription.subreddit.Posts)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return <Feed posts={flattenedPosts} />;
}
