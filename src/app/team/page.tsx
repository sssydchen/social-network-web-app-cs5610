import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-zinc-100 py-10">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-zinc-800 mb-6">Team Members</h1>
        <p className="text-zinc-600 text-lg mb-4">
            Yifan Chen (Sec 2), Jici Jiang (Sec 3), Wen Xu (Sec 2)
        </p>
        <Link
          href="https://github.com/sssydchen/social-network-web-app-cs5610"
          className={buttonVariants()}
        >
          GitHub Repo
        </Link>
        <div className="mt-6">
          <Link href="/" className="text-zinc-500 hover:underline text-sm">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;