import { ArticleSummary } from "@/@types/articles"
import Avatar from "@/components/shared/avatar"
import Image from "next/image"
import Link from "next/link"
import { FaCircleCheck, FaComments } from "react-icons/fa6"

interface ArticleSummaryCardProps {
    article: ArticleSummary
}

export default function ArticleSummaryCard(props: Readonly<ArticleSummaryCardProps>) {
    return (
        <article className="flex flex-col items-start justify-between">
            <div className="relative aspect-[16/9] h-full w-full sm:aspect-[2/1] lg:aspect-[3/2]">
                <Image
                    alt="Photo from the article"
                    src={props.article.mediaUrl}
                    className="h-auto w-full rounded-2xl bg-stone-100 object-cover"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    fill
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-stone-900/10 ring-inset" />
            </div>
            <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={props.article.createdAt.toString()} className="text-shadow-500">
                        {new Date(props.article.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>

                    <span className="text-shadow-500 flex items-center gap-x-1">
                        <FaComments aria-hidden="true" className="size-5" />
                        <span>({props.article.commentsCount})</span>
                    </span>
                </div>
                <div className="group relative">
                    <div className="grid">
                        <h3 className="text-shadow-900 group-hover:text-shadow-600 mt-3 text-lg font-semibold">
                            <Link href={`/articles/${props.article.id}/${props.article.slug}`}>
                                <span className="absolute inset-0" />
                                {props.article.title}
                            </Link>
                        </h3>
                        <h4 className="text-shadow-900 group-hover:text-shadow-600 text-sm font-semibold">
                            {props.article.subTitle}
                        </h4>
                    </div>

                    <p className="text-shadow-600 mt-5 line-clamp-3 text-sm leading-6">{props.article.summary}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                    <Avatar name={props.article.author.username} src={props.article.author.avatarUrl} size={36} />
                    <Link href={`/profile/${props.article.author.username}`} className="w-max text-sm">
                        <p className="text-shadow-900 flex items-center gap-x-1 font-semibold">
                            {props.article.author.username}
                            {props.article.author.isVerified && (
                                <span className="text-marigold-500" title="Verified author">
                                    <FaCircleCheck aria-hidden="true" className="size-4" />
                                </span>
                            )}
                        </p>
                        {props.article.author.role === "ADMIN" && (
                            <span
                                className="mt-2 rounded-full border border-red-400 bg-red-100 px-2 py-0.5 text-xs leading-none font-medium text-red-800 select-none dark:bg-red-900 dark:text-red-300"
                                aria-label="User is an admin">
                                Admin
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </article>
    )
}
