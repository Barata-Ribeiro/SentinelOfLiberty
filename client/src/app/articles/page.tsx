import { Paginated }                 from "@/@types/application"
import { ArticleSummary }            from "@/@types/articles"
import getAllPublicArticlesPaginated from "@/actions/articles/get-all-public-articles-paginated"
import NavigationPagination          from "@/components/shared/navigation-pagination"
import { auth }                      from "auth"
import { Metadata }                  from "next"
import Image                         from "next/image"
import Link                          from "next/link"
import articlePagePhoto              from "../../../public/articles-page-photo.jpg"

interface ArticlePageProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Articles",
    description: "This is the public articles page, where you can see all the articles published by our authors.",
    keywords: "articles, list",
}

export default async function ArticlesPage({ searchParams }: Readonly<ArticlePageProps>) {
    if (!searchParams) return null
    
    const page = parseInt((await searchParams).page as string, 10) || 0
    const perPage = parseInt((await searchParams).perPage as string, 10) || 10
    const direction = ((await searchParams).direction as string) || "DESC"
    const orderBy = ((await searchParams).orderBy as string) || "createdAt"
    
    const sessionPromise = auth()
    const articlesListPromise = getAllPublicArticlesPaginated({ page, perPage, direction, orderBy })
    
    const [ session, state ] = await Promise.all([ sessionPromise, articlesListPromise ])
    
    const pagination = state.response?.data as Paginated<ArticleSummary>
    const content = pagination.content ?? []
    
    return (
        <div className="container">
            { session && session.user.role === "ADMIN" && (
                <section className="mx-auto max-w-7xl py-12 sm:py-24">
                    <div className="relative isolate overflow-hidden bg-stone-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <svg
                            viewBox="0 0 1024 1024"
                            aria-hidden="true"
                            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
                            <circle
                                r={ 512 }
                                cx={ 512 }
                                cy={ 512 }
                                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                                fillOpacity="0.7"
                            />
                            <defs>
                                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                    <stop stopColor="#ddb115" />
                                    <stop offset={ 1 } stopColor="#f3dd51" />
                                </radialGradient>
                            </defs>
                        </svg>
                        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                            <h2 className="text-shadow-100 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                Start writing your articles
                            </h2>
                            <p className="text-shadow-300 mt-6 text-lg/8 text-pretty">
                                Share your knowledge and experiences with the world. Start writing your articles today
                                and get them published on our platform.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row lg:justify-start">
                                <Link
                                    href="/articles/write"
                                    aria-label="Start writing your articles"
                                    className="bg-marigold-600 text-marigold-50 hover:bg-marigold-500 focus-visible:outline-marigold-600 active:bg-marigold-700 inline-flex items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-xs transition duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Get started
                                </Link>
                                <Link
                                    href="/articles/rules"
                                    aria-label="Learn more about the rules for writing articles"
                                    className="text-shadow-100 hover:text-shadow-200 active:text-shadow-300 focus-visible:outline-marigold-600 active:bg-marigold-700 inline-flex items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-xs transition duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2">
                                    Learn more <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        <div className="relative mt-16 h-80 lg:mt-8">
                            <Image
                                alt="Person using MacBook Pro photo. Photo by @glenncarstenspeters on Unsplash"
                                src={ articlePagePhoto }
                                className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md border border-stone-900 bg-stone-500 ring-2 ring-offset-stone-50 brightness-90 grayscale-50"
                            />
                        </div>
                    </div>
                </section>
            ) }
            
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Our Articles
                </h1>
                <p className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.totalElements } articles available. Enjoy reading!
                </p>
            </header>

            <main className="mt-8 border-t border-stone-200 pt-8 sm:mt-14 sm:pt-14">
                {/*TODO: IMPLEMENT ARTICLES LIST*/ }
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
