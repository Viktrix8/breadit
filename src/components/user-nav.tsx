"use client";
import { User } from "@prisma/client";
import Avatar from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  user: Pick<User, "email" | "image">;
};

export default function UserNav({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar user={{ email: user.email, image: user.image }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/" className="flex items-center">
            <Newspaper className="w-4 h-4 mr-2" />
            Feed
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/r/create" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
