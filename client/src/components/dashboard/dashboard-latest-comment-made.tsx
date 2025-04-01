import { Comment }                              from "@/@types/comments"
import { formatCommentDate, formatDisplayDate } from "@/utils/functions"
import Link                                     from "next/link"

interface DashboardLatestCommentMadeProps {
    comment: Comment
}

export default function DashboardLatestCommentMade({ comment }: Readonly<DashboardLatestCommentMadeProps>) {
    return (
        <li className="grid gap-y-2 not-last:pb-4">
            <div className="flex w-max flex-col gap-2 divide-stone-200 max-sm:divide-y sm:flex-row sm:divide-x">
                <time
                    dateTime={ new Date(comment.createdAt).toISOString() }
                    aria-label={ `Commented on ${ formatDisplayDate(String(comment.createdAt), "date") }` }
                    title={ `Commented on ${ formatDisplayDate(String(comment.createdAt), "date") }` }
                    className="text-shadow-500 block pr-0 pb-2 text-xs sm:pr-2 sm:pb-0">
                    { formatDisplayDate(String(comment.createdAt), "date") }
                </time>

                <p className="text-shadow-300 block text-xs">
                    { formatCommentDate(new Date(comment.createdAt).toISOString()) }
                </p>
            </div>
            <h3 className="text-shadow-900 text-xl font-medium">
                Comment on{ " " }
                <Link
                    href={ `/articles/${ comment.articleId }/${ comment.articleSlug }` }
                    className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline"
                    aria-label={ `Read the article titled ${ comment.articleTitle }` }
                    title={ `Read the article titled ${ comment.articleTitle }` }>
                    { comment.articleTitle }
                </Link>
            </h3>
            <p
                className="text-shadow-600 truncate"
                aria-label={ `Comment content: ${ comment.content }` }
                title={ `Comment content: ${ comment.content }` }>
                { comment.content }
            </p>
        </li>
    )
}
