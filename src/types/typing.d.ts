import { Post, Subreddit, User, Comment } from "@prisma/client";

type ExtendedPost = Post & {
  author: User;
  subreddit: Subreddit;
  Comments: Comment[];
  Votes: ExtendedVote[];
};

type ExtendedVote = Vote & {
  user: User;
};