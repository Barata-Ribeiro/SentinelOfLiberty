import { ArticleSummary }         from "@/@types/articles"
import { Suggestion }             from "@/@types/suggestions"
import getLatestPublicArticles    from "@/actions/articles/get-latest-public-articles"
import getLatestPublicSuggestions from "@/actions/suggestions/get-latest-public-suggestions"
import { auth }                   from "auth"
import { Metadata }               from "next"

export const metadata: Metadata = {
    title: "Home | Sentinel of Liberty",
    description: "Welcome to the Sentinel of Liberty, the place where you can engage with your favorite creator and help them create the content you love.",
}


export default async function HomePage() {
    const sessionPromise = auth()
    const latestArticlesPromise = getLatestPublicArticles()
    const latestSuggestionsPromise = getLatestPublicSuggestions()
    
    const [ session, latestArticlesState, latestSuggestionsState ] = await Promise.all([
                                                                                           sessionPromise,
                                                                                           latestArticlesPromise,
                                                                                           latestSuggestionsPromise,
                                                                                       ])
    
    if (!latestArticlesState.ok || !latestSuggestionsState.ok) {
        return (
            <div>
                <h1>ERROR!</h1>
            </div>
        )
    }
    
    const latestArticles = latestArticlesState.response?.data as Set<ArticleSummary>
    const latestSuggestions = latestSuggestionsState.response?.data as Set<Suggestion>
    
    return (
        <main>
            {/*// TODO: Add the rest of the page*/ }
        </main>
    )
}
