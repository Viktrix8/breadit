import { User } from "next-auth";

type userId = string;

declare module "next-auth" {
  interface Session {
    user: {
      id: userId;
      username: string | null;
      email: string;
      image: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string | null;
    id: userId;
    email: string;
    picture: string;
  }
}
