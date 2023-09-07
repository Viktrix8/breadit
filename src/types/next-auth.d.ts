import { User } from "next-auth";

type userId = string;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
      username: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string | null;
    id: userId;
  }
}
