"use client"

import { Paginated, ProblemDetails } from "@/@types/application"
import { ArticleSummary } from "@/@types/articles"
import getAllPublicArticlesByAuthorPaginated from "@/actions/articles/get-all-public-articles-by-author-paginated"
import Spinner from "@/components/helpers/spinner"
import { formatDisplayDate } from "@/utils/functions"
import Image from "next/image"
import Link from "next/link"
import { use, useEffect, useRef, useState, useTransition } from "react"
import { FaCommentDots } from "react-icons/fa6"
import { LuImageOff } from "react-icons/lu"

interface ProfileArticlesWrittenListProps {
    articlesPromise: ReturnType<typeof getAllPublicArticlesByAuthorPaginated>
}

export default function ProfileArticlesWrittenList({ articlesPromise }: Readonly<ProfileArticlesWrittenListProps>) {
    const firstArticles = use(articlesPromise)
    const articlesState = firstArticles.response?.data as Paginated<ArticleSummary>

    const [articles, setArticles] = useState<ArticleSummary[]>(articlesState.content ?? [])
    const [pagination, setPagination] = useState(articlesState.page)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [noMore, setNoMore] = useState(false)

    const regionRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (noMore) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreArticles()
                    observer.disconnect()
                }
            },
            { threshold: 1 },
        )
        if (regionRef.current) observer.observe(regionRef.current)
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [regionRef.current, isPending, noMore, pagination])

    if (!articlesState) {
        return <div className="text-red-500">No articles found.</div>
    }

    const hasMore = pagination && (pagination.number + 1) * pagination.size < pagination.totalElements

    function loadMoreArticles() {
        if (isPending || !hasMore || noMore) return

        startTransition(async () => {
            setError(null)

            try {
                const nextPage = pagination.number + 1
                const nextArticles = await getAllPublicArticlesByAuthorPaginated({
                    username: articlesState.content[0].author.username,
                    page: nextPage,
                    perPage: pagination.size,
                    direction: "DESC",
                    orderBy: "createdAt",
                })

                if (nextArticles.ok && nextArticles.response?.data) {
                    const newArticles = nextArticles.response.data as Paginated<ArticleSummary>
                    setArticles(prev => [...prev, ...newArticles.content])
                    setPagination(newArticles.page)
                    if ((newArticles.page.number + 1) * newArticles.page.size >= newArticles.page.totalElements) {
                        setNoMore(true)
                    }
                } else setError("Failed to load more articles.")
            } catch (e: unknown) {
                const isProblemDetails = (e as ProblemDetails)?.type !== undefined
                const errorMessage = isProblemDetails
                    ? (e as ProblemDetails).detail
                    : "An unexpected error occurred while loading more articles."
                setError(errorMessage)
                return
            }
        })
    }

    return (
        <section aria-label="Articles written by user" className="mx-auto w-full max-w-2xl">
            <ul className="grid gap-6">
                {articles.map(article => (
                    <li
                        key={article.id}
                        className="group flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row"
                        aria-label={`Article: ${article.title}`}>
                        <div
                            className="relative flex w-full flex-shrink-0 items-center justify-center overflow-hidden rounded bg-stone-100 max-md:h-28 md:max-w-28"
                            aria-hidden="true">
                            {article.mediaUrl ? (
                                <Image
                                    src={article.mediaUrl}
                                    alt={article.title || "Article image"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (min-width: 769px) 200px"
                                    className="rounded object-cover transition-transform group-hover:scale-105"
                                    priority={false}
                                    aria-label={article.title || "Article image"}
                                />
                            ) : (
                                <span
                                    className="flex h-full w-full flex-col items-center justify-center rounded bg-gray-200 text-xs text-gray-400"
                                    aria-label="No image available">
                                    <LuImageOff className="mb-1 text-2xl" aria-hidden="true" />
                                    No Image
                                </span>
                            )}
                        </div>
                        <article className="flex flex-1 flex-col" aria-labelledby={`article-title-${article.id}`}>
                            <header>
                                <Link
                                    href={`/articles/${article.id}`}
                                    className="text-marigold-500 group-hover:text-marigold-600 active:text-marigold-700 line-clamp-2 text-lg font-semibold group-hover:underline"
                                    title={article.title}
                                    id={`article-title-${article.id}`}
                                    aria-label={`Read article: ${article.title}`}>
                                    {article.title}
                                </Link>
                                <span
                                    className="text-shadow-500 mb-1 text-sm"
                                    aria-label={`Subtitle: ${article.subTitle}`}>
                                    {article.subTitle}
                                </span>
                            </header>
                            <div
                                className="text-shadow-500 mb-2 flex items-center justify-between text-xs"
                                aria-label="Article metadata">
                                <span>
                                    {formatDisplayDate(new Date(article.createdAt).toISOString(), "date")} •{" "}
                                    {article.author.displayName}
                                </span>
                                <span
                                    className="inline-flex items-center gap-x-1"
                                    aria-label={`${article.commentsCount} comments`}
                                    title={`${article.commentsCount} comments`}>
                                    <FaCommentDots aria-hidden size={18} />({article.commentsCount})
                                </span>
                            </div>
                            <p
                                className="text-shadow-700 line-clamp-2 text-sm"
                                aria-label={`Summary: ${article.summary ?? ""}`}>
                                {article.summary ?? ""}
                            </p>
                        </article>
                    </li>
                ))}
            </ul>

            <div ref={regionRef} className="flex items-center justify-center py-6" aria-live="polite">
                {isPending && (
                    <p className="inline-flex items-center gap-x-2 text-blue-500" aria-label="Loading more articles...">
                        <Spinner /> Loading more articles...
                    </p>
                )}
                {!hasMore || noMore ? <span className="text-shadow-400">No more articles to load.</span> : null}
                {error && <span className="text-red-500">{error}</span>}
            </div>
        </section>
    )
}
