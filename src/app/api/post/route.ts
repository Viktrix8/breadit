import { NextRequest } from "next/server";
import { prisma } from "@/lib/db"

export const GET = async (req: NextRequest) => {
    try {
        const pageParam = req.nextUrl.searchParams.get('pageParam');
        const subredditId = req.nextUrl.searchParams.get('subredditId');

        if (!pageParam || !subredditId)
            return new Response('Missing params', { status: 400 })

        const posts = await prisma.post.findMany({
            where: {
                subredditId: subredditId
            },
            take: 5,
            skip: parseInt(pageParam) * 5,
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
        })

        return new Response(JSON.stringify(posts), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}