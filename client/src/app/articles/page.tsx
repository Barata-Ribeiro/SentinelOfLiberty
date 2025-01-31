import { Paginated }                 from "@/@types/application"
import { ArticleSummary }            from "@/@types/articles"
import getAllPublicArticlesPaginated from "@/actions/articles/get-all-public-articles-paginated"
import ArticleSummaryCard            from "@/components/articles/article-summary-card"
import NewArticleCta                 from "@/components/articles/new-article-cta"
import NavigationPagination          from "@/components/shared/navigation-pagination"
import { auth }                      from "auth"
import { Metadata }                  from "next"

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
                    <NewArticleCta />
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

            <main className="mx-auto my-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 border-t border-stone-200 pt-8 sm:my-14 sm:pt-14 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                { content.map(article => (
                    <ArticleSummaryCard key={ article.id } article={ article } />
                )) }
                
                { content.length === 0 && (
                    <p className="text-shadow-600 col-span-3 text-lg/8">
                        There are no articles available at the moment.
                    </p>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
