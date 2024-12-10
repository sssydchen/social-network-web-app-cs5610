import { cn } from '@/lib/utils'
import { Suspense } from "react";
import '@/styles/globals.css'
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import { Provider } from '@radix-ui/react-toast'
import Providers from '@/components/Providers'
import '@uploadthing/react/styles.css'

export const metadata = {
  title: 'Greennit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={cn(
        "bg - white text - slate - 900 antialiased light", inter.className)}>
      < body className="min-h-screen pt-12 bg0slate-50 antialiased" >
        <Providers>
        <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
          <Navbar />
          </Suspense>
          {authModal}

          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
        </Providers>
      </body >
    </html >
  )
}
