import SignUpButton from "@/components/sign-up";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

export default function SignUp({}: Props) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen flex overflow-y-auto h-screen items-center justify-center">
        <div className="items-center py-64">
          <div className="bg-white text-center w-fit mx-auto p-6 rounded">
            <h2 className="font-bold text-xl tracking-wide">Welcome!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-center text-sm mb-3">
              By continuing, you are setting up a Reddit account and agree to
              our User Agreement and Privacy Policy.
            </p>
            <SignUpButton />
            <hr className="my-4" />
            <span className="text-sm text-muted-foreground">
              Already have an account?
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "link" })}
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
