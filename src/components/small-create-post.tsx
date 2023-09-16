"use client";

import Avatar from "./avatar";
import { Input } from "./ui/input";
import { Image, Link } from "lucide-react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  user: Pick<User, "image" | "email">;
  subredditTitle: string;
};

export default function SmallCreatePost({ user, subredditTitle }: Props) {
  const router = useRouter();

  return (
    <div
      className="bg-white cursor-pointer p-2 rounded border flex items-center gap-3"
      onClick={() => router.push(`/r/${subredditTitle}/submit`)}
    >
      <Avatar user={{ image: user.image, email: user.email }} />
      <Input className="flex-1" placeholder="Create Post" />
      <div className="flex gap-6">
        <Image className="w-6 h-6 text-muted-foreground" />
        <Link className="w-6 h-6 text-muted-foreground" />
      </div>
    </div>
  );
}
