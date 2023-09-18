"use client";
import { Post, User } from "@prisma/client";
import { format } from "timeago.js";
import EditorjsOutput from "./editorjs-output";

type ExtendedPost = Post & {
  author: User;
};

type Props = {
  posts: ExtendedPost[];
};

export default function Feed({ posts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex bg-white border p-4 rounded cursor-pointer gap-2"
        >
          <div>
            {/* TODO: Upvotes */}
            upvotes
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Posted by u/{post.author.username} · {format(post.createdAt)}
            </p>
            <p className="text-blue-600 text-lg mb-2">{post.title}</p>
            <EditorjsOutput data={post.content} />
          </div>
        </div>
      ))}
    </div>
  );
}
