import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token?.picture;
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      if (!dbUser.username) {
        await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      token.id = dbUser?.id;
      token.username = dbUser.username;
      token.email = dbUser?.email;
      token.picture = dbUser?.image;

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
