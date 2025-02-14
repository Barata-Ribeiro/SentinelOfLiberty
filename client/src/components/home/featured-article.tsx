import { ArticleSummary } from "@/@types/articles"
import Image              from "next/image"
import Link               from "next/link"

interface FeaturedArticleProps {
    latestArticle: ArticleSummary
}

export default function FeaturedArticle({ latestArticle }: FeaturedArticleProps) {
    return (
        <article className="relative flex h-[30rem] w-full flex-wrap rounded-lg bg-stone-50 max-md:p-5 md:px-10 md:py-32">
            <Image
                src={ latestArticle.mediaUrl }
                alt={ `Image of article: ${ latestArticle.title }` }
                title={ `Image of article: ${ latestArticle.title }` }
                className="rounded-md object-cover object-center italic opacity-15"
                sizes="(min-width: 808px) 50vw, 100vw"
                priority
                fill
            />
            <div className="relative h-fit w-full text-center text-balance">
                <h2 className="text-shadow-900 mb-2 text-xl font-medium lg:text-2xl">{ latestArticle.title }</h2>
                <p className="prose text-shadow-800 mx-auto leading-relaxed">{ latestArticle.summary }</p>
                <Link
                    href={ `/articles/${ latestArticle.id }/${ latestArticle.slug }` }
                    className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 mt-3 inline-flex cursor-pointer items-center gap-x-1 font-medium decoration-2 underline-offset-2 select-none hover:underline">
                    Read More <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </article>
    )
}
