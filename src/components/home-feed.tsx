import { prisma } from "@/lib/db";
import Feed from "./feed";

type Props = {};

export default async function HomeFeed({}: Props) {
  const postsFromSubscribedSubreddits = await prisma.subscription.findMany({
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
