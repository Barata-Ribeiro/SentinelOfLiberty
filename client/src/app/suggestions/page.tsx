import { Paginated }              from "@/@types/application"
import { Suggestion }             from "@/@types/suggestions"
import getAllSuggestionsPaginated from "@/actions/suggestions/get-all-suggestions-paginated"
import LinkButton                 from "@/components/shared/link-button"
import NavigationPagination       from "@/components/shared/navigation-pagination"
import SuggestionCard             from "@/components/suggestions/suggestion-card"
import { Metadata }               from "next"

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
                        <LinkButton
                            href="/suggestions/write"
                            aria-label="Start writing your suggestions"
                            className="bg-marigold-600 text-marigold-50 hover:bg-marigold-500 active:bg-marigold-700 px-3.5 py-2.5 shadow-xs">
                            Get started
                        </LinkButton>
                        <LinkButton
                            href="/suggestions/rules"
                            aria-label="Learn more about the rules for writing suggestions"
                            className="text-shadow-900 hover:text-shadow-800 active:text-shadow-700 px-3.5 py-2.5 hover:bg-stone-100 active:bg-stone-200">
                            Learn more <span aria-hidden="true">&rarr;</span>
                        </LinkButton>
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
                    <SuggestionCard key={ suggestion.id } suggestion={ suggestion } />
                )) }
                
                { content.length === 0 && (
                    <p className="text-shadow-400 text-lg/8">There are no suggestions available at the moment.</p>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
