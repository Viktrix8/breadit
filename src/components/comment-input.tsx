"use client";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentCreationRequest } from "@/types/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
};

export default function CommentInput({ postId }: Props) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const { mutate: submitComment, isLoading } = useMutation({
    mutationFn: async (content: string) => {
      const paylod: CommentCreationRequest = {
        content,
        postId,
      };

      const { data } = await axios.post("/api/comment/create", paylod);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Oops!",
            description: "You have to be signed in to create community.",
            variant: "destructive",
          });
        } else if (error.response?.status === 404) {
          return toast({
            title: "Oops!",
            description: "Post with given id doesn't exist, please try again.",
            variant: "destructive",
          });
        } else if (error.response?.status === 400) {
          return toast({
            title: "Oops!",
            description: "The comment should be between 1 and 125 characters.",
            variant: "destructive",
          });
        } else {
          return toast({
            title: "Oops!",
            description: "An unexpected error has occured, please try again.",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Comment posted",
        description: "Your comment has been posted",
      });

      router.refresh();
    },
  });

  const onSubmit = async (data: FieldValues) => {
    submitComment(data.content);
    reset();
  };

  return (
    <form className="flex-1 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Textarea className="w-full" {...register("content")} />
      <Button className="mt-2" isLoading={isLoading}>
        Post Comment
      </Button>
    </form>
  );
}
