import { prisma } from "@/lib/db";
import Feed from "./feed";

type Props = {
  subredditId: string;
};

export default async function CommunityFeed({ subredditId }: Props) {
  const posts = await prisma.post.findMany({
    where: {
      subredditId: subredditId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      subreddit: true,
      Comments: true,
    },
    take: 10,
  });

  return (
    <div className="mt-4">
      <Feed posts={posts} />
    </div>
  );
}
