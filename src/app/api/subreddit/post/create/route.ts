import { getAuthSession } from "@/lib/auth"
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit"
import { db } from "@/lib/db"
import { z } from 'zod'
import { PostValidator } from "@/lib/validators/post"


export async function POST (req: Request){
    try{
        const session = await getAuthSession()

        if(!session?.user){
           return new Response('Unauthorized', {status: 401}) 
        }

        const body = await req.json()

        const { subredditId,title, content } = PostValidator.parse(body)

        const subsciptionExists= await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        })

        if(!subsciptionExists){
            return new Response('Subscribe to post',{
                status: 400,
            })
        }

        await db.post.create({
            data:{
                title,
                content,
                authorId: session.user.id,
                subredditId,
            },
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError){
            return new Response('Invalid POST request data passed', {status: 422})
        }

        return new Response('Could not post to subreddit at this time, please try again later', 
            { 
                status: 500
            }
        )
    }
}