import { Post as PostType, User } from "@prisma/client";
import Post from "./post";

type ExtendedPost = PostType & {
  author: User;
};

type Props = {
  posts: ExtendedPost[];
};

export default function Feed({ posts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {posts.length ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div className="bg-white border p-4 rounded">
          <p className="text-muted-foreground">There are no posts.</p>
        </div>
      )}
    </div>
  );
}
