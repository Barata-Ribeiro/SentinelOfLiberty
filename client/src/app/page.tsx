import { ArticleSummary }         from "@/@types/articles"
import { Notice }                 from "@/@types/notices"
import { Suggestion }             from "@/@types/suggestions"
import getAllAvailableCategories  from "@/actions/articles/get-all-available-categories"
import getLatestPublicArticles    from "@/actions/articles/get-latest-public-articles"
import getLatestNotices           from "@/actions/notices/get-latest-notices"
import getLatestPublicSuggestions from "@/actions/suggestions/get-latest-public-suggestions"
import CategoriesSlider           from "@/components/home/categories-slider"
import HomeNotices                from "@/components/home/home-notices"
import CategoriesSliderSkeleton   from "@/components/layout/skeletons/categories-slider-skeleton"
import { auth }                   from "auth"
import { Metadata }               from "next"
import { Suspense }               from "react"

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
    const availableCategoriesPromise = getAllAvailableCategories()
    
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

            <h2 className="text-shadow-600 mb-2 text-center font-semibold before:mr-0.5 before:content-['—'] after:ml-0.5 after:content-['—']">
                Categories
            </h2>
            <Suspense fallback={ <CategoriesSliderSkeleton /> }>
                <CategoriesSlider categoriesPromise={ availableCategoriesPromise } />
            </Suspense>
            
            {/*// TODO: Add the rest of the page*/ }
        </main>
    )
}
