import { Article }                     from "@/@types/articles"
import getArticleById                  from "@/actions/articles/get-article-by-id"
import { auth }                        from "auth"
import { Metadata, ResolvingMetadata } from "next"
import Image                           from "next/image"
import Link                            from "next/link"
import { notFound }                    from "next/navigation"
import { FaLink }                      from "react-icons/fa6"

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
    
    const sessionPromise = auth()
    const articlePromise = getArticleById({ id: parseInt(id) })
    
    const [ session, articleState ] = await Promise.all([ sessionPromise, articlePromise ])
    if (!articleState) return notFound()
    
    const article = articleState.response?.data as Article
    
    return (
        <div className="container grid grid-cols-1 gap-4">
            <article className="space-y-6">
                <header className="grid grid-cols-1 items-center justify-between gap-4 md:grid-cols-2">
                    <div className="mt-4 space-y-2 text-center md:mt-0 md:text-left">
                        <time dateTime={ String(article.createdAt) } className="text-shadow-300 text-sm">
                            { new Date(article.createdAt)
                                .toLocaleDateString(undefined, {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                .replace(/\//g, " \u00B7 ") }
                        </time>
                        <h1 className="text-shadow-900 text-4xl font-medium text-balance">{ article.title }</h1>
                        <h2 className="text-shadow-700 text-xl text-balance">{ article.subTitle }</h2>
                    </div>

                    <div className="relative min-h-96">
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
                                    className="text-shadow-400 hover:text-shadow-500 flex min-w-0 items-center gap-x-2 text-sm hover:underline">
                                    <span className="shrink-0 rounded-full bg-yellow-100 p-2">
                                        <FaLink aria-hidden="true" className="size-4" />
                                    </span>
                                    { reference.length > 30 ? `${ reference.substring(0, 30) }...` : reference }
                                </Link>
                            </div>
                        )) }
                    </aside>
                    <div className="text-shadow-900 prose prose-sm sm:prose-base w-full focus:outline-none">
                        { article.content }
                    </div>
                </main>
            </article>
        </div>
    )
}
