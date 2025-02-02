"use client"

import { State }          from "@/@types/application"
import { ArticleSummary } from "@/@types/articles"
import Image              from "next/image"
import Link               from "next/link"
import { use }            from "react"

interface LatestArticlesListingProps {
    articlesState: Promise<State>
}

export default function LatestArticlesListing({ articlesState }: LatestArticlesListingProps) {
    const articlesSummarized = use(articlesState)
    if (!articlesSummarized) return null
    
    const articles = articlesSummarized.response?.data as ArticleSummary[]
    
    return (
        <ul>
            { articles.slice(0, 3).map(article => (
                <li key={ article.slug } className="max-w-96">
                    <Link href={ `/articles/${ article.id }/${ article.slug }` }
                          aria-label={ `Read more about ${ article.title }` }
                          title={ `Read more about ${ article.title }` }
                          className="group grid grid-cols-1 gap-2">
                        <div className="relative min-h-48">
                            <Image
                                src={ article.mediaUrl }
                                alt="Preview from article"
                                className="h-auto object-cover brightness-50 group-hover:brightness-100 transition-all"
                                quality={ 50 }
                                fill
                            />
                            <time
                                dateTime={ String(article.createdAt) }
                                className="text-shadow-50 absolute inset-0 h-max w-max rounded-br-lg bg-stone-900 px-2 py-1 text-sm">
                                { new Date(article.createdAt)
                                    .toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    .replace(/\//g, " \u00B7 ") }
                            </time>
                        </div>
                        <h3 className="text-marigold-600 my-2 text-xl font-semibold group-hover:text-marigold-700 group-active:text-marigold-800">{ article.title }</h3>
                    </Link>
                </li>
            )) }
        </ul>
    )
}
