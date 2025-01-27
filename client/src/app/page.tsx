import { ArticleSummary }         from "@/@types/articles"
import { Notice }                 from "@/@types/notices"
import { Suggestion }             from "@/@types/suggestions"
import getLatestPublicArticles    from "@/actions/articles/get-latest-public-articles"
import getLatestNotices           from "@/actions/notices/get-latest-notices"
import getLatestPublicSuggestions from "@/actions/suggestions/get-latest-public-suggestions"
import HomeNotices                from "@/components/home/home-notices"
import { auth }                   from "auth"
import { Metadata }               from "next"

export const metadata: Metadata = {
    title: "Home | Sentinel of Liberty",
    description:
        "Welcome to the Sentinel of Liberty, the place where you can engage with your favorite creator and help them create the content you love.",
}

export default async function HomePage() {
    const sessionPromise = auth()
    const latestArticlesPromise = getLatestPublicArticles()
    const latestSuggestionsPromise = getLatestPublicSuggestions()
    const latestNoticesPromise = getLatestNotices()
    
    const [ session, latestArticlesState, latestSuggestionsState, latestNoticesState ] = await Promise.all([
                                                                                                               sessionPromise,
                                                                                                               latestArticlesPromise,
                                                                                                               latestSuggestionsPromise,
                                                                                                               latestNoticesPromise,
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
    const latestNotices = latestNoticesState.response?.data as Set<Notice>
    
    return (
        <main className="container">
            <HomeNotices notices={ latestNotices } />
            {/*// TODO: Add the rest of the page*/ }
        </main>
    )
}
