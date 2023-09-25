import CommunityFeed from "@/components/community-feed";
import SmallCreatePost from "@/components/small-create-post";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function page({ params: { slug } }: Props) {
  const session = await getAuthSession();

  const subreddit = await prisma.subreddit.findFirst({
    where: {
      title: slug,
    },
    include: {
      subscription: true,
    },
  });

  if (!subreddit) return notFound();

  return (
    <div className="col-span-2">
      {session && (
        <SmallCreatePost
          user={{ image: session.user.image, email: session.user.email }}
          subredditTitle={subreddit.title}
        />
      )}
      <CommunityFeed subredditId={subreddit.id} />
    </div>
  );
}
