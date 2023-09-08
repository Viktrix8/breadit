import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breadit | Home",
  description: "Reddit Clone using Next.js 13 and prisma.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-slate-100")}>
        <Providers>
          <Navbar />
          <div className="container py-4">{children}</div>
          <Toaster />
          {authModal}
        </Providers>
      </body>
    </html>
  );
}
