import { Article } from "@/@types/articles"
import { formatDisplayDate } from "@/utils/functions"
import Image from "next/image"

interface MainArticleHeaderProps {
    article: Article
}

export default function MainArticleHeader({ article }: Readonly<MainArticleHeaderProps>) {
    const publishedDate = new Date(article.createdAt).toLocaleDateString(navigator.language ?? "en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })

    return (
        <header className="grid grid-cols-1 items-center justify-between gap-4 md:grid-cols-2">
            <div className="mt-4 space-y-2 text-center md:mt-0 md:text-left">
                <time
                    dateTime={new Date(article.createdAt).toISOString()}
                    aria-label={`Published on ${formatDisplayDate(String(article.createdAt), "dateTime")}`}
                    title={`Published on ${formatDisplayDate(String(article.createdAt), "dateTime")}`}
                    className="text-shadow-300 text-sm">
                    {publishedDate.replace(/\//g, " \u00B7 ")}
                </time>
                <h1 className="text-shadow-900 text-4xl font-medium text-balance">{article.title}</h1>
                <h2 className="text-shadow-700 text-xl text-balance">{article.subTitle}</h2>
            </div>

            <div className="relative min-h-[20rem] md:min-h-[30rem]">
                <Image
                    src={article.mediaUrl}
                    alt={article.title}
                    className="h-auto w-full object-cover"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    fill
                />
            </div>
        </header>
    )
}
