import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Forward } from "lucide-react";

type Props = {
  url: string;
};

export default function ShareButton({ url }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center cursor-pointer">
          <Forward className="w-4 h-4" />
          <span className="text-sm ml-2">Share</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Copy link and share post to anyone you want.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input defaultValue={process.env.NEXT_PUBLIC_URL + url} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
