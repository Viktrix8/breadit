import Link from "next/link";
import Icons from "@/components/icons";
import { buttonVariants } from "./ui/button";
import { getAuthSession } from "@/lib/auth";
import UserNav from "./user-nav";

type Props = {};

export default async function Navbar({}: Props) {
  const session = await getAuthSession();
  return (
    <nav className="shadow bg-white">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Icons.logo className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Breadit</span>
        </Link>

        {/* TODO: Search Bar */}
        <div className="w-2xl"></div>

        {session ? (
          <UserNav
            user={{
              email: session.user.email,
              image: session.user.image,
            }}
          />
        ) : (
          <div className="flex gap-2">
            <Link href="/sign-up" className={buttonVariants()}>
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "secondary" })}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
