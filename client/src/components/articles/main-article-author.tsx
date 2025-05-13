import { Author } from "@/@types/user"
import { Session } from "next-auth"
import Link from "next/link"
import { FaCircleCheck, FaUser } from "react-icons/fa6"

interface MainArticleAuthorProps {
    session: Session | null
    author: Author
}

export default function MainArticleAuthor({ session, author }: Readonly<MainArticleAuthorProps>) {
    return (
        <div className="grid grid-cols-1 gap-y-2 divide-y divide-stone-100">
            <h3 className="text-shadow-900 text-xl">Author</h3>
            <div className="flex w-max items-center justify-between p-4">
                <Link
                    href={session ? `/dashboard/${author.username}` : `/profile/${author.username}`}
                    aria-label={session ? "You're the author" : `Author ${author.username}`}
                    title={session ? "You're the author" : `Author ${author.username}`}
                    className="text-shadow-400 hover:text-shadow-500 active:text-shadow-600 inline-flex min-w-0 items-center gap-x-2 text-sm hover:underline max-sm:max-w-[2rem]">
                    <span className="bg-marigold-100 shrink-0 rounded-full p-2">
                        <FaUser aria-hidden="true" className="size-4" />
                    </span>
                    {author.username}
                    {author.isVerified && (
                        <span className="text-marigold-500" aria-label="Verified author" title="Verified author">
                            <FaCircleCheck aria-hidden="true" className="size-4" />
                        </span>
                    )}
                </Link>
            </div>
        </div>
    )
}
