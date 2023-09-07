import { User } from "@prisma/client";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "./ui/avatar";

type Props = {
  user: Pick<User, "email" | "image">;
};

export default function Avatar({ user }: Props) {
  return (
    <AvatarPrimitive>
      <AvatarImage src={user.image} alt="profile" />
      <AvatarFallback>{user.email.slice(0, 2)}</AvatarFallback>
    </AvatarPrimitive>
  );
}
