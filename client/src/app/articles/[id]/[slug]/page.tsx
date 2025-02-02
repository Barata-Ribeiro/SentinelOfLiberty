import { Article }                                                from "@/@types/articles"
import getArticleById                                             from "@/actions/articles/get-article-by-id"
import getLatestPublicArticles                                    from "@/actions/articles/get-latest-public-articles"
import LatestArticlesListing                                      from "@/components/articles/latest-articles-listing"
import MemoizedContent                                            from "@/components/helpers/memoized-content"
import { auth }                                                   from "auth"
import { Metadata, ResolvingMetadata }                            from "next"
import { headers }                                                from "next/headers"
import Image                                                      from "next/image"
import Link                                                       from "next/link"
import { notFound }                                               from "next/navigation"
import { Suspense }                                               from "react"
import { FaLink, FaLinkedin, FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6"

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
    
    const headerPromise = headers()
    const sessionPromise = auth()
    const articlePromise = getArticleById({ id: parseInt(id) })
    const latestAriclesPromise = getLatestPublicArticles()
    
    // TODO: Use session to verify if the user is the author of the article
    const [ headersList, session, articleState ] = await Promise.all([ headerPromise, sessionPromise, articlePromise ])
    if (!articleState) return notFound()
    
    const pathname = headersList.get("x-current-path")
    const article = articleState.response?.data as Article
    
    return (
        <div className="grid grid-cols-1 gap-4">
            <article className="container space-y-6">
                <header className="grid grid-cols-1 items-center justify-between gap-4 md:grid-cols-2">
                    <div className="mt-4 space-y-2 text-center md:mt-0 md:text-left">
                        <time dateTime={ String(article.createdAt) } className="text-shadow-300 text-sm">
                            { new Date(article.createdAt)
                                .toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                .replace(/\//g, " \u00B7 ") }
                        </time>
                        <h1 className="text-shadow-900 text-4xl font-medium text-balance">{ article.title }</h1>
                        <h2 className="text-shadow-700 text-xl text-balance">{ article.subTitle }</h2>
                    </div>

                    <div className="relative min-h-[20rem] md:min-h-[30rem]">
                        <Image
                            src={ article.mediaUrl }
                            alt={ article.title }
                            className="h-auto w-full object-cover"
                            sizes="(min-width: 808px) 50vw, 100vw"
                            fill
                        />
                    </div>
                </header>

                <main className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <aside className="border-marigold-500 w-max divide-y divide-stone-100 border-t-4 pt-4">
                        <h3 className="text-shadow-900 pb-2 text-xl">References</h3>
                        { article.references.map((reference, index) => (
                            <div
                                key={ `reference-${ index + Math.random() }` }
                                className="flex w-max items-center justify-between p-4">
                                <Link
                                    href={ reference }
                                    aria-label={ `Reference to ${ reference }` }
                                    title={ `Reference to ${ reference }` }
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-400 hover:text-shadow-500 flex min-w-0 items-center gap-x-2 text-sm hover:underline max-sm:max-w-[2rem]">
                                    <span className="shrink-0 rounded-full bg-yellow-100 p-2">
                                        <FaLink aria-hidden="true" className="size-4" />
                                    </span>
                                    { reference.length > 30 ? `${ reference.substring(0, 30) }...` : reference }
                                </Link>
                            </div>
                        )) }
                    </aside>

                    <div className="w-full !max-w-4xl">
                        <MemoizedContent html={ article.content } />

                        <footer className="mt-8 space-y-4 divide-y divide-stone-100">
                            <div className="flex flex-wrap items-center gap-4 pb-4">
                                { Array.from(article.categories).map(category => (
                                    <Link
                                        key={ `category-${ category.id }-${ category.name }` }
                                        href={ `/articles/category/${ category.name }` }
                                        aria-label={ `Category ${ category.name }` }
                                        title={ `Category ${ category.name }` }
                                        className="text-shadow-700 focus-visible:outline-marigold-600 hover:text-shadow-900 active:text-shadow-800 rounded bg-stone-100 px-2 py-1 capitalize transition duration-200 select-none hover:bg-stone-300 focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-stone-200">
                                        { category.name }
                                    </Link>
                                )) }
                            </div>

                            <div className="flex items-center gap-x-2">
                                <span className="text-shadow-500 text-sm">Share:</span>
                                <Link
                                    href={ `https://x.com/intent/tweet/?url=${ article.title }&url=${ pathname }` }
                                    aria-label="Share on X"
                                    title="Share on X"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaSquareXTwitter aria-hidden="true" className="size-8" />
                                </Link>
                                <Link
                                    href={ `https://www.facebook.com/sharer/sharer.php?u=${ pathname }` }
                                    aria-label="Share on Facebook"
                                    title="Share on Facebook"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaSquareFacebook aria-hidden="true" className="size-8" />
                                </Link>
                                <Link
                                    href={ `https://www.linkedin.com/shareArticle?url=${ pathname }` }
                                    aria-label="Share on LinkedIn"
                                    title="Share on LinkedIn"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaLinkedin aria-hidden="true" className="size-8" />
                                </Link>
                            </div>
                        </footer>
                    </div>
                </main>
            </article>

            <section className="bg-stone-200">
                <div className="container grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                    <div className="mt-8 min-w-0 space-y-2 sm:min-w-[19rem]">
                        <h3 className="text-shadow-900 text-4xl font-semibold text-balance">Latest Articles</h3>
                        <Link
                            href="/articles"
                            className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 text-sm underline">
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
