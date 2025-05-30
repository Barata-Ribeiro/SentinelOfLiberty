import { ArticleSummary } from "@/@types/articles"
import { Notice } from "@/@types/notices"
import { Suggestion } from "@/@types/suggestions"
import getLatestPublicArticles from "@/actions/articles/get-latest-public-articles"
import getLatestNotices from "@/actions/notices/get-latest-notices"
import getLatestPublicSuggestions from "@/actions/suggestions/get-latest-public-suggestions"
import CategoriesSlider from "@/components/home/categories-slider"
import FeaturedArticle from "@/components/home/featured-article"
import HomeArticleItem from "@/components/home/home-article-item"
import HomeNotices from "@/components/home/home-notices"
import HomeQuote from "@/components/home/home-quote"
import HomeSuggestionItem from "@/components/home/home-suggestion-item"
import CategoriesSliderSkeleton from "@/components/layout/skeletons/categories-slider-skeleton"
import { auth } from "auth"
import { Metadata } from "next"
import { Session } from "next-auth"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Home | Sentinel of Liberty",
    description:
        "Welcome to the Sentinel of Liberty, the place where you can engage with your favorite creator and help them create the content you love.",
}

function NoMoreWrittenArticleMessage(props: Readonly<{ session: Session | null }>) {
    return (
        <li className="text-shadow-600 col-span-2 my-20 text-center lg:my-52">
            No more articles to show.{" "}
            {props.session ? (
                <>
                    Write one now{" "}
                    <Link
                        href="/articles/write"
                        className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline">
                        here!
                    </Link>
                </>
            ) : (
                "Wait for one of our creators to write one."
            )}
        </li>
    )
}

export default async function HomePage() {
    const [session, latestArticlesState, latestSuggestionsState, latestNoticesState] = await Promise.all([
        auth(),
        getLatestPublicArticles(),
        getLatestPublicSuggestions(),
        getLatestNotices(),
    ])

    const latestArticles = latestArticlesState.response?.data as Set<ArticleSummary>
    const latestSuggestions = latestSuggestionsState.response?.data as Set<Suggestion>
    const latestNotices = latestNoticesState.response?.data as Set<Notice>

    const sortedArticles = Array.from(latestArticles).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    const latestArticle = sortedArticles[0]
    const latestArticlesList = sortedArticles.slice(1)
    const latestSuggestionsList = Array.from(latestSuggestions)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    return (
        <div className="container">
            <HomeNotices notices={latestNotices} />

            <h2 className="text-shadow-600 mb-2 text-center font-semibold before:mr-0.5 before:content-['—'] after:ml-0.5 after:content-['—']">
                Categories
            </h2>
            <Suspense fallback={<CategoriesSliderSkeleton />}>
                <CategoriesSlider />
            </Suspense>

            <div className="my-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_25rem] xl:grid-cols-[1fr_30rem]">
                <main className="flex flex-col gap-y-4 max-lg:order-2">
                    <FeaturedArticle latestArticle={latestArticle} />

                    <ul className="grid w-full grid-cols-1 items-start justify-center gap-4 lg:grid-cols-2">
                        {latestArticlesList.map(article => (
                            <HomeArticleItem key={article.id} article={article} session={session} />
                        ))}

                        {latestArticlesList.length < 2 && <NoMoreWrittenArticleMessage session={session} />}
                    </ul>
                </main>

                <aside className="order-1 mx-auto grid w-fit items-center gap-y-4 self-start">
                    <HomeQuote />

                    <div>
                        <h2 className="text-shadow-900 font-medium">Latest News</h2>
                        <ul className="grid gap-y-4 border-t-2 pt-4">
                            {latestSuggestionsList.map(suggestion => (
                                <HomeSuggestionItem key={suggestion.id} suggestion={suggestion} />
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    )
}
