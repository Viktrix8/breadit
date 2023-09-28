"use client";
import { VoteRequest } from "@/types/validators/vote";
import { Post,  Vote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { ExtendedVote } from "@/types/typing";


type Props = {
  initialVotes: ExtendedVote[];
  post: Pick<Post, "id">;
};

export default function Vote({ initialVotes, post }: Props) {
  const [votes, setVotes] = useState<
    {
      type: string;
      userId: string;
      postId: string;
    }[]
  >(initialVotes);
  const { data: session } = useSession();
  const previousVotes = initialVotes;

  const { mutate: submitVote } = useMutation({
    mutationKey: ["vote"],
    mutationFn: async (type: VoteType) => {
      const payload: VoteRequest = {
        type,
        postId: post.id,
      };

      const { data } = await axios.post("/api/post/vote", payload);
      return data;
    },
    onMutate: (type: VoteType) => {
      if (!session) return;

      const userVote = votes.find((vote) => vote.userId === session?.user.id);

      if (userVote) {
        if (userVote.type === type) {
          setVotes((prev) =>
            prev.filter((vote) => vote.userId !== session?.user.id)
          );
        } else {
          setVotes((prev) =>
            prev.map((vote) =>
              vote.userId === session?.user.id ? { ...vote, type } : vote
            )
          );
        }
      } else {
        setVotes((prev) => [
          ...prev,
          {
            type,
            userId: session?.user.id,
            postId: post.id,
          },
        ]);
      }
    },
    onError: (err) => {
      setVotes(previousVotes);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: "Error",
            description: "You must be logged in to vote.",
            variant: "destructive",
          });
        } else {
          return toast({
            title: "Error",
            description: "An error occurred. Please try again later.",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your vote has been submitted.",
      });
    },
  });

  return (
    <div className="flex cursor-pointer items-center justify-center flex-col">
      <ArrowBigUp
        onClick={() => submitVote("UP")}
        className={`w-6 h-6 ${
          votes.find(
            (vote) => vote.type === "UP" && vote.userId === session?.user.id
          ) && "fill-emerald-300"
        }`}
      />
      <span>
        {votes.reduce((acc, val) => (val.type === "UP" ? ++acc : --acc), 0)}
      </span>
      <ArrowBigDown
        onClick={() => submitVote("DOWN")}
        className={`w-6 h-6 ${
          votes.find(
            (vote) => vote.type === "DOWN" && vote.userId === session?.user.id
          ) && "fill-red-300"
        }`}
      />
    </div>
  );
}
