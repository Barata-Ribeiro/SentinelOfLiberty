import { ArticleSummary } from "@/@types/articles"
import Image from "next/image"
import Link from "next/link"

interface HomeArticleItemProps {
    article: ArticleSummary
}

export default function HomeArticleItem({ article }: HomeArticleItemProps) {
    return (
        <li className="flex items-center gap-2 rounded-lg border-2 p-2">
            <Image
                src={article.mediaUrl}
                alt={`Image of article: ${article.title}`}
                title={`Image of article: ${article.title}`}
                width={100}
                height={100}
                quality={50}
                className="size-24 rounded-md object-cover object-center"
            />

            <div className="grid w-fit">
                <time dateTime={String(article.createdAt)} className="text-shadow-600 text-sm">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </time>
                <Link
                    href={`/articles/${article.id}/${article.title}`}
                    aria-label={`Read more about ${article.title}`}
                    title={`Read more about ${article.title}`}
                    className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700">
                    <h2 className="max-w-[35ch]">{article.title}</h2>
                </Link>
            </div>
        </li>
    )
}
