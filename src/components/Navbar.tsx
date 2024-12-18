import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'

export default async function Navbar() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z=[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href='/' className="flex gap-2 items-center">
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Greennit
          </p>
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
        </Link>

        <SearchBar />

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign In
          </Link>
        )}

        <Link href="/team" className={buttonVariants({ variant: "outline" })}>
          Team & GitHub
        </Link>
      </div>
    </div>
  )
}
