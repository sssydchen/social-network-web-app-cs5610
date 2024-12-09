import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { UsernameValidator } from "@/lib/validators/username"

export async function PATCH(req: Request) {
    try{
        const session = await getAuthSession()

        if(!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        const { name } = UsernameValidator.parse(body)

        const username = await db.user.findFirst({ // check if username is already taken
            where: {
                username: name,
            },
        })

        if (username) {
            return new Response('Username already taken', { status: 409 })
        }

        await db.user.update({ // update username
            where: {
                id: session.user.id, 
            }, 
            data: {
                username: name
            }
        })
        return new Response('OK')
    } catch (error){

    }
}