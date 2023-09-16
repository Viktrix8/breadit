"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { SubscriptionRequest } from "@/types/validators/subscription";
import axios, { AxiosError } from "axios";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

type Props = {
  subredditId: string;
  isSubscribed: boolean;
};

export default function SubscribeToggle({ subredditId, isSubscribed }: Props) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscriptionRequest = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data;
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        toast({
          title: "Success",
          description: `You have ${
            isSubscribed ? "unsubscribed from" : "subscribed to"
          } this subreddit.`,
        });
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return toast({
            title: "Oops!",
            description: "You have to be signed in to subscribe to community.",
            variant: "destructive",
          });
        } else if (error.response?.status === 404) {
          return toast({
            title: "Oops!",
            description: "This subreddit does not exist.",
            variant: "destructive",
          });
        } else if (error.response?.status === 403) {
          return toast({
            title: "Oops!",
            description: "You cannot unsubscribe to your own subreddit.",
            variant: "destructive",
          });
        }
      } else {
        return toast({
          title: "Oops!",
          description: "An unexpected error has occured, please try again.",
          variant: "destructive",
        });
      }
    },
  });

  return isSubscribed ? (
    <Button isLoading={isLoading} className="w-full" onClick={() => mutate()}>
      Unsubscribe
    </Button>
  ) : (
    <Button isLoading={isLoading} className="w-full" onClick={() => mutate()}>
      Subscribe
    </Button>
  );
}
