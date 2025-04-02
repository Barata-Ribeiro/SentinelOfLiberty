import { Article }                     from "@/@types/articles"
import getArticleById                  from "@/actions/articles/get-article-by-id"
import getLatestPublicArticles         from "@/actions/articles/get-latest-public-articles"
import getPopularPublicArticles        from "@/actions/articles/get-popular-public-articles"
import getCommentTree                  from "@/actions/comments/get-comment-tree"
import LatestArticlesListing           from "@/components/articles/latest-articles-listing"
import MainArticleAuthor               from "@/components/articles/main-article-author"
import MainArticleCommentTree          from "@/components/articles/main-article-comment-tree"
import MainArticleFooter               from "@/components/articles/main-article-footer"
import MainArticleHeader               from "@/components/articles/main-article-header"
import MainArticleReferences           from "@/components/articles/main-article-references"
import MainArticleSuggestion           from "@/components/articles/main-article-suggestion"
import PopularArticlesListing          from "@/components/articles/popular-articles-listing"
import NewCommentForm                  from "@/components/forms/new-comment-form"
import MemoizedContent                 from "@/components/helpers/memoized-content"
import CommentSkeleton                 from "@/components/layout/skeletons/comment-skeleton"
import LatestArticlesItemSkeleton      from "@/components/layout/skeletons/latest-articles-item-skeleton"
import PopularArticlesListSkeleton     from "@/components/layout/skeletons/popular-articles-list-skeleton"
import { auth }                        from "auth"
import { Metadata, ResolvingMetadata } from "next"
import { headers }                     from "next/headers"
import Link                            from "next/link"
import { notFound }                    from "next/navigation"
import { Suspense }                    from "react"

interface ArticlePageProps {
    params: Promise<{
        id: string
        slug: string
    }>
}

export async function generateMetadata({ params }: ArticlePageProps, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = await params
    
    const articleState = await getArticleById({ id: parseInt(id) })
    if (!articleState) return notFound()
    
    const previousImages = (await parent).openGraph?.images ?? []
    
    const article = articleState.response?.data as Article
    
    return {
        title: article.title,
        description: article.summary,
        openGraph: {
            type: "article",
            title: article.title,
            description: article.summary,
            images: [ article.mediaUrl, ...previousImages ],
        },
    }
}

export default async function ArticlePage({ params }: Readonly<ArticlePageProps>) {
    const { id, slug } = await params
    if (!id || !slug) return notFound()
    
    const [ headersList, session, articleState ] = await Promise.all([
                                                                         headers(),
                                                                         auth(),
                                                                         getArticleById({ id: parseInt(id) }),
                                                                     ])
    if (!articleState) return notFound()
    
    const pathname = headersList.get("x-current-path")
    const article = articleState.response?.data as Article
    if (article.slug !== slug) return notFound()
    
    const latestArticlesPromise = getLatestPublicArticles()
    const commentTreePromise = getCommentTree({ articleId: article.id })
    const popularArticlesPromise = getPopularPublicArticles()
    
    return (
        <div className="container grid grid-cols-1 gap-4">
            <article id="article" className="space-y-6">
                <MainArticleHeader article={ article } />

                <main className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <aside className="border-marigold-500 w-max border-t-4 pt-4">
                        <MainArticleAuthor session={ session } author={ article.author } />
                        <MainArticleSuggestion suggestion={ article.suggestion } />
                        <MainArticleReferences references={ article.references } />
                    </aside>

                    <div id="article-content" className="w-full !max-w-4xl">
                        <MemoizedContent html={ article.content } />
                        <MainArticleFooter article={ article } pathname={ pathname } />
                    </div>
                </main>
            </article>

            <section id="latest-articles-section" className="bg-stone-200">
                <div className="container grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <div className="mt-8 min-w-0 space-y-2 sm:min-w-[17.5rem]">
                        <h2 className="text-shadow-900 text-4xl font-semibold text-balance">Latest Articles</h2>
                        <Link
                            href="/articles"
                            className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 text-sm tracking-wide underline">
                            View all articles
                        </Link>
                    </div>

                    <ul className="grid max-w-4xl grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Suspense fallback={ <LatestArticlesItemSkeleton /> }>
                            <LatestArticlesListing articlesState={ latestArticlesPromise } />
                        </Suspense>
                    </ul>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="grid max-w-4xl grid-cols-1 gap-4">
                    <section id="new-comment-form" aria-labelledby="new-comment-section-title">
                        <h3
                            id="new-comment-section-title"
                            className="text-shadow-900 mb-6 border-b border-stone-200 pb-3 text-2xl font-bold">
                            New Comment
                        </h3>
                        <NewCommentForm />
                    </section>

                    <section id="article-comments" aria-labelledby="comments-section-title">
                        <h3
                            id="comments-section-title"
                            className="text-shadow-900 mb-6 border-b border-stone-200 pb-3 text-2xl font-bold">
                            Comments
                        </h3>
                        <Suspense fallback={ <CommentSkeleton /> }>
                            <MainArticleCommentTree commentTreePromise={ commentTreePromise } />
                        </Suspense>
                    </section>
                </div>

                <aside aria-label="Article Sidebar" className="space-y-4" aria-labelledby="article-sidebar-title">
                    <div className="min-w-0 space-y-2">
                        <h4 id="article-sidebar-title" className="text-shadow-900 text-4xl font-semibold text-balance">
                            Popular Articles
                        </h4>
                        <Link
                            href="/articles"
                            className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 text-sm tracking-wide underline">
                            View all articles
                        </Link>
                    </div>

                    <Suspense fallback={ <PopularArticlesListSkeleton /> }>
                        <PopularArticlesListing articlesState={ popularArticlesPromise } />
                    </Suspense>
                </aside>
            </section>
        </div>
    )
}
