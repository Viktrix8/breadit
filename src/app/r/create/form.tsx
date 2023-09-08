"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CreateSubredditRequest } from "@/types/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

export default function Form({}: Props) {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async (title: string) => {
      const payload: CreateSubredditRequest = {
        title,
      };

      const { data } = await axios.post("/api/subreddit/create", payload);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Subreddit successfuly created.",
      });
      router.push(`/r/${title}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Oops!",
            description: "You have to be signed in to create community.",
            variant: "destructive",
          });
        } else if (error.response?.status === 409) {
          return toast({
            title: "Oops!",
            description:
              "Subreddit name is already taken, please choose a different one.",
            variant: "destructive",
          });
        } else if (error.response?.status === 400) {
          return toast({
            title: "Oops!",
            description:
              "The name of the community should be between 3 and 21 characters.",
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
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCommunity(title);
      }}
    >
      <div className="relative">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="px-6 my-2"
        />
        <span className="absolute left-3 top-2 text-muted-foreground">r/</span>
      </div>
      <Button isLoading={isLoading} className="mt-4">
        Create Community
      </Button>
    </form>
  );
}
