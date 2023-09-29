import { NextRequest } from "next/server";
import { prisma } from "@/lib/db"
import { ExtendedPost } from "@/types/typing";
import { getAuthSession } from "@/lib/auth";

const LIMIT = 5;

export const GET = async (req: NextRequest) => {
    try {
        const pageParam = req.nextUrl.searchParams.get('pageParam');
        const subredditId = req.nextUrl.searchParams.get('subredditId');

        if (!pageParam) {
            return new Response('Missing params', { status: 400 });
        }

        let posts: ExtendedPost[] = [];

        if (!subredditId) {
            const session = await getAuthSession();

            if (!session) return new Response(JSON.stringify([]), { status: 200 })
            const postsFromSubscribedSubreddits = await prisma.subscription.findMany({
                where: {
                    userId: session?.user.id,
                },
                take: LIMIT,
                skip: parseInt(pageParam) * LIMIT,
                select: {
                    subreddit: {
                        select: {
                            Posts: {
                                orderBy: {
                                    createdAt: "desc",
                                },
                                include: {
                                    author: true,
                                    subreddit: true,
                                    Comments: true,
                                    Votes: {
                                        include: {
                                            user: true,
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            });
            posts = postsFromSubscribedSubreddits.flatMap((subscription) => subscription.subreddit.Posts);
        } else {
            posts = await prisma.post.findMany({
                where: {
                    subredditId: subredditId
                },
                take: LIMIT,
                skip: parseInt(pageParam) * LIMIT,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    author: true,
                    subreddit: true,
                    Comments: true,
                    Votes: {
                        include: {
                            user: true
                        }
                    }
                }
            });
        }

        posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
}