import { Post, User, Vote as VoteType } from "@prisma/client";
import { format } from "timeago.js";
import EditorjsOutput from "./editorjs-output";
import Vote from "./vote";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import ShareButton from "./share-button";
import { ExtendedPost } from "@/types/typing";

type ExtendedVote = VoteType & {
  user: User;
};

type Props = {
  post: ExtendedPost;
  initialVotes: ExtendedVote[];
};

export default function Post({ post, initialVotes }: Props) {
  return (
    <div className="flex bg-white border p-4 rounded cursor-pointer gap-2">
      <div>
        <Vote initialVotes={initialVotes} post={{ id: post.id }} />
      </div>
      <div className="flex-1">
        <Link href={`/r/${post.subreddit.title}/post/${post.id}`}>
          <p className="text-sm text-muted-foreground">
            r/{post.subreddit.title} · Posted by u/
            {post.author.username} · {format(post.createdAt)}
          </p>
          <p className="text-blue-600 text-lg mb-2">{post.title}</p>
          <EditorjsOutput data={post.content} />
        </Link>
        <div className="text-muted-foreground mt-4 flex items-center gap-4">
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm ml-2">
              {post.Comments.length} Comments
            </span>
          </div>
          <ShareButton url={`/r/${post.subreddit.title}/post/${post.id}`} />
        </div>
      </div>
    </div>
  );
}
