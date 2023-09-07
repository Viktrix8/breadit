"use client";
import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "./ui/use-toast";

type Props = {};

export default function SignIn({}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await signIn("google", {
        callbackUrl: "/",
      });

      if (res?.error)
        throw new Error("Failed to Sign In using google, please try again.");
    } catch (error: any) {
      toast({
        title: "Oops!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={signInWithGoogle}
      isLoading={isLoading}
      variant="outline"
      className="mt-2"
    >
      <Icons.google className="w-4 h-4 mr-2" /> Sign In With Google
    </Button>
  );
}
