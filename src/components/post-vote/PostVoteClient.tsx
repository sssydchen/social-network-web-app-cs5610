'use client'
import { FC, useState, useEffect } from "react"
import { VoteType } from '@prisma/client'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { usePrevious } from '@mantine/hooks'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { PostVoteRequest } from '@/lib/validators/vote'
import { toast } from "@/hooks/use-toast"


interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
}

const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToasts()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        voteType,
        postId,
      }
      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError:( err, voteType) => {
      if(voteType === 'UP') setVotesAmt((prev)=>prev - 1)
        else setVotesAmt((prev)=>prev + 1)

      //reset current vote
      setCurrentVote(prevVote)

      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          return loginToast()
        }
      }

      return toast ({
        title:'Something went wrong',
        description:'Your vote was not registered, please try again.',
        variant:'destructive',
      })
    },
    onMutate: (type:VoteType)=>{
      if(currentVote=== type){
        setCurrentVote(undefined)
        if (type ==='UP') setVotesAmt((prev)=> prev - 1)
          else if (type ==='DOWN') setVotesAmt((prev)=> prev + 1)
      } else{
        setCurrentVote(type)
        if(type === 'UP') setVotesAmt((prev)=>prev + (currentVote ? 2:1))
        else if (type ==='DOWN') 
          setVotesAmt((prev)=> prev - (currentVote ? 2:1))
      }
    },
  })

  return <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
    <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
    </Button>

      {/* score */}
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      {/* downvote */}
        <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': currentVote === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>

  </div>
}


  export default PostVoteClient