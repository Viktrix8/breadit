import Link from "next/link";
import Icons from "@/components/icons";
import { buttonVariants } from "./ui/button";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="shadow bg-white">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Icons.logo className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Breadit</span>
        </Link>

        {/* TODO: Search Bar */}
        <div className="w-2xl"></div>

        <Link href="/sign-up" className={buttonVariants()}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
