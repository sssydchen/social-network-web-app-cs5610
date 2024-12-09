import { db } from "@/lib/db"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const q = url.searchParams.get('q')

    if(!q) return new Response('Invalid Query', { status: 400 })

    const results = await db.subreddit.findMany({
        where: {
            name: {
                startsWith: q, // search for subreddits that start with the query
            },
        }, 
        include: {
            _count: true,
        }, 
        take: 5, // limit the results to 5
    })

    return new Response(JSON.stringify(results))
}