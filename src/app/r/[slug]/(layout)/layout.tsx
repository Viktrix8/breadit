import SubscribeToggle from "@/components/subscribe-toggle";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
  children: React.ReactNode;
};

export default async function layout({ params: { slug }, children }: Props) {
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
      {children}
      <div className="bg-white border h-fit p-4 rounded">
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
        <Link
          href={`/r/${slug}/submit`}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full mt-2",
          })}
        >
          Create Post
        </Link>
      </div>
    </div>
  );
}
