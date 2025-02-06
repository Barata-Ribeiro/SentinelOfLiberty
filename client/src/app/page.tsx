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
import Image                      from "next/image"
import Link                       from "next/link"
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
    
    const latestArticle = Array.from(latestArticles)[0]
    const latestArticlesList = Array.from(latestArticles).slice(1)
    
    return (
        <div className="container">
            <HomeNotices notices={ latestNotices } />

            <h2 className="text-shadow-600 mb-2 text-center font-semibold before:mr-0.5 before:content-['—'] after:ml-0.5 after:content-['—']">
                Categories
            </h2>
            <Suspense fallback={ <CategoriesSliderSkeleton /> }>
                <CategoriesSlider categoriesPromise={ availableCategoriesPromise } />
            </Suspense>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_25rem] xl:grid-cols-[1fr_30rem]">
                <main className="grid gap-y-4 max-lg:order-2">
                    <div className="relative flex h-[30rem] w-full flex-wrap rounded-lg bg-stone-50 max-md:p-5 md:px-10 md:py-32">
                        <Image
                            src={ latestArticle.mediaUrl }
                            alt={ `Image of article: latestArticle.title` }
                            title={ `Image of article: latestArticle.title` }
                            className="rounded-md object-cover object-center italic opacity-15"
                            priority
                            fill
                        />
                        <article className="relative h-fit w-full text-center text-balance">
                            <h2 className="text-shadow-900 mb-2 text-xl font-medium lg:text-2xl">
                                { latestArticle.title }
                            </h2>
                            <p className="prose text-shadow-800 mx-auto leading-relaxed">{ latestArticle.summary }</p>
                            <Link
                                href={ `/articles/${ latestArticle.id }/${ latestArticle.title }` }
                                className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 mt-3 inline-flex cursor-pointer items-center gap-x-1 font-medium decoration-2 underline-offset-2 select-none hover:underline">
                                Read More <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </article>
                    </div>

                    <ul className="grid w-full grid-cols-1 items-start justify-center gap-4 lg:grid-cols-2">
                        { latestArticlesList.map(article => (
                            <li key={ article.id } className="flex items-center gap-2 rounded-lg border-2 p-2">
                                <Image
                                    src={ article.mediaUrl }
                                    alt={ `Image of article: ${ article.title }` }
                                    title={ `Image of article: ${ article.title }` }
                                    width={ 100 }
                                    height={ 100 }
                                    quality={ 50 }
                                    className="size-24 rounded-md object-cover object-center"
                                />

                                <div className="grid w-fit">
                                    <time dateTime={ String(article.createdAt) } className="text-shadow-600 text-sm">
                                        { new Date(article.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }) }
                                    </time>
                                    <Link
                                        href={ `/articles/${ article.id }/${ article.title }` }
                                        aria-label={ `Read more about ${ article.title }` }
                                        title={ `Read more about ${ article.title }` }
                                        className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700">
                                        <h2 className="max-w-[35ch]">{ article.title }</h2>
                                    </Link>
                                </div>
                            </li>
                        )) }
                        
                        { latestArticlesList.length < 2 && (
                            <li className="col-span-2 my-20 text-center lg:my-52" id="empty-article-list">
                                <span className="text-shadow-600 text-lg">
                                    No more articles to display. Write another one
                                    <Link
                                        href="/articles/write"
                                        className="hover:text-marigold-600 font-medium hover:underline">
                                        here
                                    </Link>
                                    .
                                </span>
                            </li>
                        ) }
                    </ul>
                </main>

                <aside className="order-1 mx-auto grid w-fit items-center gap-y-4 self-start">
                    <div className="mx-auto w-full p-4 text-center lg:w-3/4 xl:w-1/2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="text-shadow-400 mb-8 inline-block size-8"
                            viewBox="0 0 975.036 975.036">
                            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                        </svg>
                        <p className="prose-xl leading-relaxed">
                            If liberty means anything at all, it means the right to tell people what they do not want to
                            hear.
                        </p>
                        <span className="mt-8 mb-6 inline-block h-1 w-10 rounded bg-stone-500"></span>
                        <h2 className="title-font text-shadow-900 text-sm font-medium tracking-wider">GEORGE ORWELL</h2>
                        <p className="text-shadow-500">Writer</p>
                    </div>

                    <div>
                        <h2 className="text-shadow-900 font-medium">Latest News</h2>
                        <ul className="grid gap-y-4 border-t-2 pt-4">
                            { Array.from(latestSuggestions).map(suggestion => (
                                <li
                                    key={ suggestion.id }
                                    className="flex items-center gap-2 rounded-lg border-2 border-stone-200 p-2">
                                    <Image
                                        src={ suggestion.mediaUrl }
                                        alt={ `Image of original news: ${ suggestion.title }` }
                                        title={ `Image of original news: ${ suggestion.title }` }
                                        width={ 100 }
                                        height={ 100 }
                                        quality={ 50 }
                                        className="size-24 rounded-md object-cover object-center"
                                    />

                                    <div className="grid w-fit">
                                        <time
                                            dateTime={ String(suggestion.createdAt) }
                                            className="text-shadow-600 text-sm">
                                            { new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            }) }
                                        </time>
                                        <Link
                                            href={ suggestion.sourceUrl }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700">
                                            <h2 className="max-w-[35ch]">{ suggestion.title }</h2>
                                        </Link>
                                    </div>
                                </li>
                            )) }
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    )
}
