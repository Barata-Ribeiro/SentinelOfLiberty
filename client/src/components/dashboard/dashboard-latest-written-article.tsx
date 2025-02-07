import { ArticleSummary } from "@/@types/articles"
import Image              from "next/image"
import Link               from "next/link"

interface DashboardLatestWrittenArticleProps {
    article: ArticleSummary
}

export default function DashboardLatestWrittenArticle({ article }: DashboardLatestWrittenArticleProps) {
    return (
        <article className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
            <div className="relative h-48 w-full lg:h-auto lg:w-72">
                <Image
                    src={ article.mediaUrl }
                    alt={ `Image of article: ${ article.title }` }
                    title={ `Image of article: ${ article.title }` }
                    className="h-auto w-full rounded-md object-cover"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    quality={ 50 }
                    fill
                />
            </div>

            <div className="flex w-full max-w-prose flex-col gap-y-2">
                <time dateTime={ String(article.createdAt) } className="text-shadow-300 text-sm">
                    { new Date(article.createdAt)
                        .toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        .replace(/\//g, " \u00B7 ") }
                </time>
                <h2 className="text-shadow-900 hover:text-marigold-700 active:text-marigold-600 text-xl font-semibold tracking-tight text-pretty hover:underline sm:text-3xl">
                    <Link
                        href={ `/articles/${ article.id }/${ article.slug }` }
                        aria-label={ `Read article: ${ article.title }` }
                        title={ `Read article: ${ article.title }` }>
                        { article.title }
                    </Link>
                </h2>
                <p className="text-shadow-600 prose mt-2 max-w-prose">{ article.summary }</p>
            </div>
        </article>
    )
}
