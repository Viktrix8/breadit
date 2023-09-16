import SmallCreatePost from "@/components/small-create-post";
import SubscribeToggle from "@/components/subscribe-toggle";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HelpCircle } from "lucide-react";
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

  const subscription = session?.user
    ? await prisma.subscription.findFirst({
        where: {
          subredditId: subreddit.id,
          userId: session?.user.id,
        },
      })
    : null;

  const isSubscribed = !!subscription;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {session && (
          <SmallCreatePost
            user={{ image: session.user.image, email: session.user.email }}
            subredditTitle={subreddit.title}
          />
        )}
        {/* TODO: Feed */}
      </div>
      <div className="bg-white border p-4 rounded">
        <p className="flex items-center font-medium">
          <HelpCircle className="mr-2 w-4 h-4" />
          About r/{slug}
        </p>
        <hr className="my-2" />
        <div className="flex items-center justify-between">
          <p className="text-sm mt-2">Created</p>
          <p className="text-muted-foreground text-sm mt-2">
            {new Date(subreddit.createdAt).toLocaleDateString()}
          </p>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between">
          <p className="text-sm mt-2">Members</p>
          <p className="text-muted-foreground text-sm mt-2">
            {subreddit.subscription.length}
          </p>
        </div>
        <hr className="my-4" />
        {subreddit.authorId === session?.user.id ? (
          <p className="text-muted-foreground text-sm">
            You are the creator of this community.
          </p>
        ) : (
          <SubscribeToggle
            isSubscribed={isSubscribed}
            subredditId={subreddit.id}
          />
        )}
      </div>
    </div>
  );
}
