import { prisma } from "@/lib/db";
import Post from "./post";
import { ExtendedPost } from "@/types/typing";

type Props = {
  posts: ExtendedPost[];
};

export default function Feed({ posts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {posts.length &&
        posts.map(async (post) => {
          const initialVotes = await prisma.vote.findMany({
            where: {
              postId: post.id,
            },
            include: {
              user: true,
            },
          });

          return <Post key={post.id} initialVotes={initialVotes} post={post} />;
        })}
      {!posts.length && (
        <div className="bg-white border p-4 rounded">
          <p className="text-muted-foreground">There are no posts.</p>
        </div>
      )}
    </div>
  );
}
