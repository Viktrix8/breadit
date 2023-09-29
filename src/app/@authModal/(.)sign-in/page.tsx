import SignInButton from "@/components/sign-in";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

export default function SignIn({ }: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen flex overflow-y-auto h-screen items-center justify-center">
        <div className="items-center py-64">
          <div className="bg-white text-center w-fit mx-auto p-6 rounded">
            <h2 className="font-bold text-xl tracking-wide">Welcome Back!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-center text-sm mb-3">
              By continuing you agree with our User Agreement and Privacy
              Policy.
            </p>
            <SignInButton />
            <hr className="my-4" />
            <span className="text-sm text-muted-foreground">
              Don&apos;t have an account yet?
              <Link
                href="/sign-up"
                className={buttonVariants({ variant: "link" })}
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
