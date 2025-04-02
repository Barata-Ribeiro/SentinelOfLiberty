import { State }                     from "@/@types/application"
import { Article, Category }         from "@/@types/articles"
import getAllAvailableCategories     from "@/actions/articles/get-all-available-categories"
import getArticleById                from "@/actions/articles/get-article-by-id"
import EditArticleForm               from "@/components/forms/edit-article-form"
import ArticleSuggestionCardSkeleton from "@/components/layout/skeletons/article-suggestion-card-skeleton"
import ArticleSuggestionCard         from "@/components/suggestions/article-suggestion-card"
import { auth }                      from "auth"
import { notFound, redirect }        from "next/navigation"
import { Suspense }                  from "react"

interface EditArticlePageProps {
    params: Promise<{
        id: number
        slug: string
    }>
}

export default async function EditArticlePage({ params }: Readonly<EditArticlePageProps>) {
    const { id, slug } = await params
    
    const [ session, articleState, categoriesState ] = await Promise.all([
                                                                             auth(),
                                                                             getArticleById({ id }),
                                                                             getAllAvailableCategories(),
                                                                         ])
    
    if (!session) return redirect("/auth/login")
    if (session.user.role !== "ADMIN") return redirect("/")
    if (!articleState) return notFound()
    
    const article = articleState.response?.data as Article
    if (article.slug !== slug) return notFound()
    const categories = categoriesState.response?.data as Category[]
    
    const suggestionPromise = Promise.resolve<State>({
                                                         ok: true,
                                                         error: null,
                                                         response: {
                                                             data: article.suggestion,
                                                             status: articleState.response?.status ?? "INTERNAL_SERVER_ERROR",
                                                             code: articleState.response?.code ?? 0,
                                                             message: articleState.response?.message ?? "Unknown error",
                                                         },
                                                     })
    
    return (
        <div className="container">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Editing Article
                </h1>
                <p className="text-shadow-600 mt-2 text-lg/8">
                    In this page you can edit the article as long as you are an admin and follow the rules. Always make
                    sure to revise the article before publishing it. Editing an article is a serious task.
                </p>
            </header>

            <main className="mt-8 border-t border-stone-200 pt-8 sm:mt-14 sm:pt-14">
                <Suspense fallback={ <ArticleSuggestionCardSkeleton /> }>
                    { article.suggestion && <ArticleSuggestionCard suggestionPromise={ suggestionPromise } /> }
                </Suspense>
                
                <EditArticleForm categories={ categories } article={ article } />
            </main>
        </div>
    )
}
