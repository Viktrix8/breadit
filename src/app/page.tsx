import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Your Feed</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white">{/* TODO: Feed */}</div>
        <div className="bg-white border p-4 rounded">
          <p className="flex items-center font-medium">
            <HomeIcon className="mr-2 w-4 h-4" />
            Home
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Your personal Breadit frontpage. Come here to check in with your
            favorite communities.
          </p>
          <hr className="my-4" />
          <Link
            href="/r/create"
            className={buttonVariants({ className: "w-full" })}
          >
            Create Community
          </Link>
        </div>
      </div>
    </div>
  );
}
