import { Paginated }              from "@/@types/application"
import { ArticleSummary }         from "@/@types/articles"
import getAllOwnArticlesPaginated from "@/actions/articles/get-all-own-articles-paginated"
import LinkButton                 from "@/components/shared/link-button"
import NavigationPagination       from "@/components/shared/navigation-pagination"
import { auth }                   from "auth"
import { Metadata }               from "next"
import Link                       from "next/link"
import { permanentRedirect }      from "next/navigation"

interface ArticlePageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "My Article",
    description: "Listing all the articles written by you on this platform.",
}

export default async function ArticlePage({ params, searchParams }: Readonly<ArticlePageProps>) {
    const [ session, { username }, pageParams ] = await Promise.all([ auth(), params, searchParams ])
    if (!pageParams) return null
    
    if (!session || !username || session?.user.role !== "ADMIN" || session?.user.username !== username) {
        return permanentRedirect("/")
    }
    
    const search = (pageParams.search as string) || ""
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as string) || "DESC"
    const orderBy = (pageParams.orderBy as string) || "createdAt"
    
    const articlesState = await getAllOwnArticlesPaginated({ page, perPage, direction, orderBy, search })
    const pagination = articlesState.response?.data as Paginated<ArticleSummary>
    const content = pagination.content ?? []
    
    const baseUrl = `/dashboard/${ username }/articles`
    
    function buildUrl(item: string, direction: string) {
        let orderUrl = `${ baseUrl }?orderBy=${ item }`
        if (direction === "ASC") orderUrl += "&direction=ASC"
        if (search) orderUrl += `&search=${ encodeURIComponent(search) }`
        if (page) orderUrl += `&page=${ page }`
        return orderUrl
    }
    
    // TODO: IMPLEMENT SEARCH FUNCTIONALITY
    
    return (
        <div
            className="flex h-full min-h-0 flex-col justify-between"
            aria-labelledby="page-title"
            aria-describedby="page-description">
            <header className="mt-4 sm:mt-8">
                <div className="flex flex-wrap items-center justify-between">
                    <h1
                        id="page-title"
                        className="text-shadow-900 block text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                        Articles
                    </h1>

                    <LinkButton
                        href="/articles/write"
                        aria-label="Write a new article"
                        title="Write a new article"
                        buttonStyle="colored">
                        New Article
                    </LinkButton>
                </div>

                <p id="page-description" className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.page.totalElements } articles(s) written by you. Manage them here.
                </p>
            </header>

            <main className="mt-8 flow-root h-full border-t border-stone-200 pt-8">
                <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-stone-300">
                            {/*TODO: IMPLEMENT SORTING*/ }
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="text-shadow-900 py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-0">
                                        Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                        Subtitle
                                    </th>
                                    <th
                                        scope="col"
                                        className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                        Publish Date
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-0 pl-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-200 bg-white">
                                { content.map(article => (
                                    <tr key={ article.id }>
                                        <td className="text-shadow-900 py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-0">
                                            { article.id }
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                                            <Link
                                                href={ `/articles/${ article.id }/${ article.slug }` }
                                                className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline"
                                                aria-label={ `Read article: ${ article.title }` }
                                                title={ `Read article: ${ article.title }` }>
                                                { article.title }
                                            </Link>
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            { article.subTitle }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            <time dateTime={ new Date(article.createdAt).toISOString() }>
                                                { new Date(article.createdAt).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                }) }
                                            </time>
                                        </td>
                                        <td className="relative inline-flex gap-x-2 py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-0">
                                            {/*TODO: IMPLEMENT EDIT BUTTON*/ }
                                            <a>Edit</a>
                                            {/*TODO: IMPLEMENT DELETE BUTTON*/ }
                                            <a>Delete</a>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>
                </div>
                
                { pagination.page.totalElements <= 0 && (
                    <div className="flex h-96 items-center justify-center">
                        <p className="text-shadow-500 text-lg">No articles written.</p>
                    </div>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination.page } />
        </div>
    )
}
