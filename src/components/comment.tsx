import type {
  Comment,
  CommentVote as CommentVoteType,
  User,
} from "@prisma/client";
import CommentVote from "./comment-vote";
import Avatar from "./avatar";
import { format } from "timeago.js";

type ExtendedVote = CommentVoteType & {
  user: User;
};

type ExtendedComment = Comment & {
  author: User;
  Votes: ExtendedVote[];
};

type Props = {
  comment: ExtendedComment;
};

export default function Comment({ comment }: Props) {
  return (
    <div key={comment.id} className="flex items-center gap-4">
      <CommentVote initialVotes={comment.Votes} commentId={comment.id} />
      <div className="flex gap-4">
        <Avatar
          user={{
            email: comment.author.email,
            image: comment.author.image,
          }}
        />
        <div>
          <p className="font-bold text-xs">
            {comment.author.username} ·{" "}
            <span className="font-normal">{format(comment.createdAt)}</span>
          </p>
          <p className="text-md">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
