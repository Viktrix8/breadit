"use client"
import { ExtendedPost } from "@/types/typing";
import Feed from "./feed";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";

type Props = {};

export default function HomeFeed({ }: Props) {
  const [pageParam, setPageParam] = useState(0)
  const [allPosts, setAllPosts] = useState<ExtendedPost[]>([]);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { isSuccess, isFetching } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/post', {
        params: {
          pageParam
        }
      })
      console.log(data)
      return data as ExtendedPost[]
    },
    queryKey: ['posts', pageParam],
    onSuccess: (newData) => {
      setAllPosts(prevPosts => [...prevPosts, ...newData]);
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "Couldn't fetch posts, please try again.",
        variant: "destructive"
      })
    }
  })

  useEffect(() => {
    if (inView && isSuccess && !isFetching) {
      setPageParam(prev => prev + 1)
    }
  }, [inView, isSuccess, isFetching])

  return <div>
    <Feed posts={allPosts} />
    <div ref={ref} />
  </div>
}
