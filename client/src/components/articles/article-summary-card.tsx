import { ArticleSummary } from "@/@types/articles"
import Avatar from "@/components/shared/avatar"
import { formatDisplayDate } from "@/utils/functions"
import Image from "next/image"
import Link from "next/link"
import { FaCircleCheck, FaComments } from "react-icons/fa6"

interface ArticleSummaryCardProps {
    article: ArticleSummary
}

export default function ArticleSummaryCard({ article }: Readonly<ArticleSummaryCardProps>) {
    return (
        <article className="flex flex-col items-start justify-between">
            <div className="relative aspect-[16/9] h-full w-full sm:aspect-[2/1] lg:aspect-[3/2]">
                <Image
                    alt="Photo from the article"
                    src={article.mediaUrl}
                    className="h-auto w-full rounded-2xl bg-stone-100 object-cover"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    fill
                />
            </div>
            <div className="max-w-xl">
                <div className="group relative">
                    <div className="grid">
                        <h3 className="text-shadow-900 group-hover:text-shadow-600 mt-3 text-lg font-semibold">
                            <Link href={`/articles/${article.id}/${article.slug}`}>
                                <span className="absolute inset-0" />
                                {article.title}
                            </Link>
                        </h3>
                        <h4 className="text-shadow-900 group-hover:text-shadow-600 text-sm font-semibold">
                            {article.subTitle}
                        </h4>
                    </div>

                    <p className="text-shadow-600 mt-5 line-clamp-3 text-sm leading-6">{article.summary}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="relative mt-8 flex items-center gap-x-4">
                        <Avatar name={article.author.username} src={article.author.avatarUrl} size={36} />
                        <Link
                            href={`/profile/${article.author.username}`}
                            className="text-shadow-900 inline-flex w-max items-center gap-x-1 text-sm font-semibold">
                            {article.author.username}
                            {article.author.isVerified && (
                                <span className="text-marigold-500" title="Verified author">
                                    <FaCircleCheck aria-hidden="true" className="size-4" />
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                        <span className="text-shadow-500 flex items-center gap-x-1">
                            <FaComments aria-hidden="true" className="size-5" />
                            <span>({article.commentsCount})</span>
                        </span>

                        <time
                            dateTime={new Date(article.createdAt).toISOString()}
                            aria-label={`Published on ${formatDisplayDate(String(article.createdAt), "date")}`}
                            title={`Published on ${formatDisplayDate(String(article.createdAt), "date")}`}
                            className="text-shadow-500">
                            {formatDisplayDate(String(article.createdAt), "date")}
                        </time>
                    </div>
                </div>
            </div>
        </article>
    )
}
