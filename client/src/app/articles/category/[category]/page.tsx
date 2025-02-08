import { Paginated }                           from "@/@types/application"
import { ArticleSummary }                      from "@/@types/articles"
import getAllPublicArticlesByCategoryPaginated from "@/actions/articles/get-all-public-articles-by-category-paginated"
import ArticleSummaryCard                      from "@/components/articles/article-summary-card"
import NavigationPagination                    from "@/components/shared/navigation-pagination"
import { notFound }                            from "next/navigation"

interface ArticlesCategoryPageProps {
    params: Promise<{ category: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ArticlesCategoryPageProps({ params, searchParams }: ArticlesCategoryPageProps) {
    const [ pageParams, { category } ] = await Promise.all([ searchParams, params ])
    if (!pageParams) return null
    if (!category) return notFound()
    
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as string) || "DESC"
    const orderBy = (pageParams.orderBy as string) || "createdAt"
    
    const articlesState = await getAllPublicArticlesByCategoryPaginated({ category, page, perPage, direction, orderBy })
    
    const pagination = articlesState.response?.data as Paginated<ArticleSummary>
    const content = pagination.content ?? []
    
    return (
        <div className="container" aria-labelledby="page-title" aria-describedby="page-description">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1
                    id="page-title"
                    className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty capitalize sm:text-5xl">
                    Articles for { category }
                </h1>
                <p id="page-description" className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.totalElements } article(s) available under the { category } category.{ " " }
                    { pagination.totalElements > 0 ? "Enjoy reading them!" : "Wait for our authors to publish some!" }
                </p>
            </header>

            <main className="mx-auto my-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 border-t border-stone-200 pt-8 sm:my-14 sm:pt-14 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                { content.map(article => (
                    <ArticleSummaryCard key={ article.id } article={ article } />
                )) }
                
                { content.length === 0 && (
                    <p className="text-shadow-400 col-span-3 text-lg/8">
                        There are no articles available at the moment.
                    </p>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
