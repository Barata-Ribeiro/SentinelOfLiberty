"use client"

import { State }                            from "@/@types/application"
import { ArticleSummary }                   from "@/@types/articles"
import Image                                from "next/image"
import Link                                 from "next/link"
import { use, useEffect, useRef, useState } from "react"

interface PopularArticlesListingProps {
    articlePromise: Promise<State>
}

export default function PopularArticlesListing({ articlePromise }: Readonly<PopularArticlesListingProps>) {
    const [ shouldLoad, setShouldLoad ] = useState(false)
    const regionRef = useRef<HTMLUListElement>(null)
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([ entry ]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "100px" },
        )
        if (regionRef.current) observer.observe(regionRef.current)
        return () => observer.disconnect()
    }, [])
    
    let articleSummary: ArticleSummary[] = []
    
    if (shouldLoad) {
        const state = use(articlePromise)
        if (state && state.ok && state.response?.data) articleSummary = state.response.data as ArticleSummary[]
    }
    
    return (
        <ul ref={ regionRef } className="grid gap-6 sm:grid-cols-2 md:grid-cols-1">
            { articleSummary.length > 0 && articleSummary.slice(0, 3).map(article => (
                <li key={ article.slug } className="max-w-96">
                    <Link
                        href={ `/articles/${ article.id }/${ article.slug }` }
                        aria-label={ `Read more about ${ article.title }` }
                        title={ `Read more about ${ article.title }` }
                        className="group grid grid-cols-1 gap-2">
                        <div className="relative min-h-48">
                            <Image
                                src={ article.mediaUrl }
                                alt="Preview from article"
                                className="h-auto object-cover brightness-50 transition-all group-hover:brightness-100"
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
                        <h5 className="text-marigold-600 group-hover:text-marigold-700 group-active:text-marigold-800 text-xl font-semibold">
                            { article.title }
                        </h5>
                        <p className="text-shadow-900 text-sm">
                           By { article.author.displayName ?? article.author.username }
                        </p>
                    </Link>
                </li>
            )) }
        </ul>
    )
}