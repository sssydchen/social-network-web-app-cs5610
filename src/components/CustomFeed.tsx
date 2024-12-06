import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
    const session = await getAuthSession(); 

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            subreddit: true,
        },
    })

    const posts = await db.post.findMany({
        where: { // only get posts from the followed communities
            subreddit: {
                name: {
                    in: followedCommunities.map(({ subreddit }) => subreddit.name), // get the names of the followed communities
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        }, 
        include: {
            votes: true, 
            author: true, 
            comments: true, 
            subreddit: true, 
        }, 
        take: INFINITE_SCROLL_PAGINATION_RESULTS, 
    })

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed;