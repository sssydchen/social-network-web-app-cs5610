'use client'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { FC, useEffect, useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import page from '@/app/(auth)/sign-in/page'
import axios from 'axios'
import { Session } from 'inspector'
import { useSession } from 'next-auth/react'
import Post from './Post'

interface PostFeedProps {
    initialPosts: ExtendedPost[]
    subredditName?: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {


    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })

    const { data: session } = useSession()
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ['infinite-query'],
        async ({ pageParam = 1 }) => {
            const query =
                `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!subredditName ? `&subredditName=${subredditName}` : '')

            const { data } = await axios.get(query)
            return data as ExtendedPost[]
        }, {
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
    }
    )

    useEffect(() => {
        if (entry?.isIntersecting) { // if the last post is in view
            fetchNextPage()
        }
    }, [entry, fetchNextPage]
    )

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts

    return (
        <ul className='flex flex-col col-span-2 space-y-6'>
            {posts.map((post, index) => {
                const votesAmt = post.votes.reduce((acc, vote) => {
                    if (vote.type === 'UP') return acc + 1
                    if (vote.type === 'DOWN') return acc - 1
                    return acc
                }, 0)

                const currentVote = post.votes.find(
                    (vote) => vote.userId === session?.user.id
                )

                // Check if this is the last post for infinite scrolling
                const isLastPost = index === posts.length - 1;

                    return (
                        // eslint-disable-next-line react/jsx-key
                        <li key={post.id} ref={isLastPost ? ref : undefined}>
                            <Post
                                key={post.id}
                                currentVote={currentVote}
                                votesAmt={votesAmt}
                                commentAmt={post.comments.length}
                                post={post}
                                subredditName={post.subreddit.name}
                            />
                        </li>
                    )
                
            })}
        </ul>
    )
}

export default PostFeed