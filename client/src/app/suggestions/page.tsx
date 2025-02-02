import { Paginated }              from "@/@types/application"
import { Suggestion }             from "@/@types/suggestions"
import getAllSuggestionsPaginated from "@/actions/suggestions/get-all-suggestions-paginated"
import NavigationPagination       from "@/components/shared/navigation-pagination"
import { Metadata }               from "next"
import Link                       from "next/link"

interface SuggestionsPageProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Suggestions",
    description: "This is the public suggestions page, where you can see all the suggestions made by the community.",
    keywords: "suggestions, list, community, articles, write, read",
}


export default async function SuggestionsPage({ searchParams }: Readonly<SuggestionsPageProps>) {
    const pageParams = await searchParams
    if (!pageParams) return null
    
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as string) || "DESC"
    const orderBy = (pageParams.orderBy as string) || "createdAt"
    
    const suggestionListState = await getAllSuggestionsPaginated({ page, perPage, direction, orderBy })
    const pagination = suggestionListState.response?.data as Paginated<Suggestion>
    const content = pagination.content ?? []
    
    return (
        <div className="container">
            <header className="mt-4 sm:mt-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                        Suggestions Made
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-6 lg:mt-0 lg:flex-shrink-0">
                        <Link
                            href="/suggestions/write"
                            aria-label="Start writing your suggestions"
                            className="bg-marigold-600 text-marigold-50 hover:bg-marigold-500 focus-visible:outline-marigold-600 active:bg-marigold-700 inline-flex items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-xs transition duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2">
                            Get started
                        </Link>
                        <Link
                            href="/articles/rules"
                            aria-label="Learn more about the rules for writing suggestions"
                            className="text-shadow-900 hover:text-shadow-800 active:text-shadow-700 focus-visible:outline-marigold-600 inline-flex items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold transition duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2">
                            Learn more <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>

                <p className="text-shadow-600 mt-6 max-w-2xl text-lg/8 lg:mt-2">
                    There are currently { pagination.totalElements } suggestions available.{ " " }
                    { pagination.totalElements > 0
                      ? "Check them or write an article about them!"
                      : "Be the first to suggest something!" }
                </p>
            </header>

            <main className="mx-auto my-8 grid gap-y-4 border-t border-stone-200 pt-8 sm:my-14 sm:pt-14 lg:mx-0">
                { content.map(suggestion => (
                    <section key={ suggestion.id } className="rounded-md border border-stone-200 p-4">
                        <h2 className="text-shadow-900 text-2xl font-semibold tracking-tight text-pretty sm:text-3xl">
                            { suggestion.title }
                        </h2>
                        <p className="text-shadow-600 mt-2 text-lg/8">{ suggestion.content }</p>
                    </section>
                )) }
                
                { content.length === 0 && (
                    <p className="text-shadow-400 text-lg/8">There are no suggestions available at the moment.</p>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
