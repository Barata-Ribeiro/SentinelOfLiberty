import { Article }                     from "@/@types/articles"
import getArticleById                  from "@/actions/articles/get-article-by-id"
import getLatestPublicArticles         from "@/actions/articles/get-latest-public-articles"
import LatestArticlesListing           from "@/components/articles/latest-articles-listing"
import MainArticleAuthor               from "@/components/articles/main-article-author"
import MainArticleFooter               from "@/components/articles/main-article-footer"
import MainArticleHeader               from "@/components/articles/main-article-header"
import MainArticleReferences           from "@/components/articles/main-article-references"
import MemoizedContent                 from "@/components/helpers/memoized-content"
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

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id, slug } = await params
    if (!id || !slug) return notFound()
    
    const latestAriclesPromise = getLatestPublicArticles()
    
    const [ headersList, session, articleState ] = await Promise
        .all([ headers(), auth(), getArticleById({ id: parseInt(id) }) ])
    if (!articleState) return notFound()
    
    const pathname = headersList.get("x-current-path")
    const article = articleState.response?.data as Article
    
    return (
        <div className="grid grid-cols-1 gap-4">
            <article className="container space-y-6">
                <MainArticleHeader article={ article } />

                <main className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <aside className="border-marigold-500 w-max border-t-4 pt-4">
                        <MainArticleAuthor session={ session } article={ article } />
                        <MainArticleReferences article={ article } />
                    </aside>

                    <div className="w-full !max-w-4xl">
                        <MemoizedContent html={ article.content } />
                        <MainArticleFooter article={ article } pathname={ pathname } />
                    </div>
                </main>
            </article>

            <section className="bg-stone-200">
                <div className="container grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <div className="mt-8 min-w-0 space-y-2 sm:min-w-[19rem]">
                        <h3 className="text-shadow-900 text-4xl font-semibold text-balance">Latest Articles</h3>
                        <Link
                            href="/articles"
                            className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 tracking-wide text-sm underline">
                            View all articles
                        </Link>
                    </div>

                    <div className="grid max-w-4xl grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Suspense fallback={ <p>Loading...</p> }>
                            <LatestArticlesListing articlesState={ latestAriclesPromise } />
                        </Suspense>
                    </div>
                </div>
            </section>
            
            {/*TODO: Implement new comment form*/ }
            {/*TODO: Implement article comments when entering the comments range*/ }
        </div>
    )
}
