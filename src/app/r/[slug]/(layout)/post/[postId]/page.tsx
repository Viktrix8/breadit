import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Vote from "@/components/vote";
import { format } from "timeago.js";
import Link from "next/link";
import EditorjsOutput from "@/components/editorjs-output";
import { MessageSquare } from "lucide-react";
import ShareButton from "@/components/share-button";
import { getAuthSession } from "@/lib/auth";
import Comment from "@/components/comment";
import CommentInput from "@/components/comment-input";

type Props = {
  params: {
    postId: string;
  };
};

export default async function page({ params: { postId } }: Props) {
  const session = await getAuthSession();
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      author: true,
      subreddit: true,
      Votes: {
        include: {
          user: true,
        },
      },
      Comments: {
        include: {
          author: true,
          Votes: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post) return notFound();

  return (
    <div className="col-span-2 bg-white p-4">
      <div className="flex gap-4">
        <div>
          <Vote post={post} initialVotes={post.Votes} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">
            <Link
              href={`/r/${post.subreddit.title}`}
              className={"hover:underline hover:underline-offset-4"}
            >
              r/{post.subreddit.title}
            </Link>{" "}
            ·{" "}
            <span className="font-normal">
              Posted by u/{post.author.username} {format(post.createdAt)}
            </span>
          </p>
          <p className="font-medium text-3xl mt-2">{post.title}</p>
          <EditorjsOutput data={post.content} className="mt-4" />
          <div>
            <div className="text-muted-foreground mt-4 flex items-center gap-4">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm ml-2">
                  {post.Comments.length} Comments
                </span>
              </div>
              <ShareButton url={`/r/${post.subreddit.title}/post/${post.id}`} />
            </div>
            <div className="mt-6">
              {session && (
                <div>
                  <p className="text-xs mb-2">
                    Comment as{" "}
                    <span className="text-blue-500">
                      {session.user.username}
                    </span>
                  </p>
                  <CommentInput postId={post.id} />
                </div>
              )}

              <div className="flex flex-col mt-4 gap-6">
                {post.Comments.length ? (
                  post.Comments.map((comment) => (
                    <Comment comment={comment} key={comment.id} />
                  ))
                ) : (
                  <p className="font-medium text-sm">No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
