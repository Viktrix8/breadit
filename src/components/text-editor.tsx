"use client";
import { FieldValues, useForm } from "react-hook-form";
import Header from "@editorjs/header";
import EditorJS, {
  BlockToolConstructable,
  OutputData,
} from "@editorjs/editorjs";
import Link from "@editorjs/link";
import SimpleImage from "@editorjs/simple-image";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { PostCreationRequest } from "@/types/validators/post";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { useEffect, useRef, useState } from "react";

type Props = {
  subredditName: string;
};

export default function TextEditor({ subredditName }: Props) {
  const router = useRouter();
  const editorRef = useRef<EditorJS>();
  const { register, handleSubmit, getValues } = useForm();
  const [data, setData] = useState<OutputData>();

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header as unknown as BlockToolConstructable,
          },
          linkTool: {
            class: Link,
            config: {
              endpoint: "/api/link",
            },
          },
          image: SimpleImage,
          list: {
            class: List,
            config: {
              defaultStyle: "unordered",
            },
          },
          code: Code,
          quoteTool: Quote,
        },
        inlineToolbar: true,
        placeholder: "Enter your content.",
        async onChange(api, event) {
          const data = await api.saver.save();
          setData(data);
        },
      });

      editorRef.current = editor;
    }
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  const { mutate: savePost, isLoading } = useMutation({
    mutationFn: async (payload: PostCreationRequest) => {
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Post was successfuly posted.",
      });

      router.push(`/r/${subredditName}`);
      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: "Oops!",
            description: "You have to be signed in to create post.",
            variant: "destructive",
          });
        } else if (err.response?.status === 404) {
          return toast({
            title: "Oops!",
            description: "Subreddit name doesn't exist.",
            variant: "destructive",
          });
        } else if (err.response?.status === 400) {
          return toast({
            title: "Oops!",
            description: "The title should be between 1 and 50 characters.",
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

  const onSubmit = async (formData: FieldValues) => {
    const title = formData.title;

    if (data?.blocks.length)
      savePost({ title, content: JSON.stringify(data.blocks), subredditName });
  };

  return (
    <div className="bg-white relative mt-4  min-h-[500px] p-6 rounded w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <TextareaAutosize
          {...register("title")}
          placeholder="Enter post title"
          autoFocus
          className="font-bold focus-within:outline-none text-6xl w-full"
        />
        <div id="editorjs" className="editorjs flex-1" />
        <Button
          type="submit"
          disabled={!data?.blocks.length || isLoading}
          isLoading={isLoading}
        >
          Post
        </Button>
      </form>
    </div>
  );
}
