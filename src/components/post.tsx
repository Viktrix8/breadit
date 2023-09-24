import { prisma } from "@/lib/db";
import { Post, User } from "@prisma/client";
import { format } from "timeago.js";
import EditorjsOutput from "./editorjs-output";
import Vote from "./vote";

type ExtendedPost = Post & {
  author: User;
};

type Props = {
  post: ExtendedPost;
};

export default async function Post({ post }: Props) {
  const votes = await prisma.vote.findMany({
    where: {
      postId: post.id,
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="flex bg-white border p-4 rounded cursor-pointer gap-2">
      <div>
        <Vote initialVotes={votes} post={{ id: post.id }} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          Posted by u/{post.author.username} · {format(post.createdAt)}
        </p>
        <p className="text-blue-600 text-lg mb-2">{post.title}</p>
        <EditorjsOutput data={post.content} />
      </div>
    </div>
  );
}
