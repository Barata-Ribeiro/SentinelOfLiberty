import { Dashboard, Profile } from "@/@types/user"
import getOwnDashboard from "@/actions/users/get-own-dashboard"
import getOwnProfile from "@/actions/users/get-own-profile"
import DashboardLatestCommentMade from "@/components/dashboard/dashboard-latest-comment-made"
import DashboardLatestSuggestionMade from "@/components/dashboard/dashboard-latest-suggestion-made"
import DashboardLatestWrittenArticle from "@/components/dashboard/dashboard-latest-written-article"
import DashboardSiteInteractions from "@/components/dashboard/dashboard-site-interactions"
import DashboardUserProfile from "@/components/dashboard/dashboard-user-profile"
import LogoutButton from "@/components/dashboard/logout-button"
import LinkButton from "@/components/shared/link-button"
import { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { LuInfo, LuMailbox, LuNewspaper, LuUserSearch } from "react-icons/lu"

interface DashboardHomePageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Readonly<DashboardHomePageProps>): Promise<Metadata> {
    const username = (await params).username
    return {
        title: `${username}`,
        description: "This is the dashboard home page",
    }
}

function NoWrittenArticleMessage(props: Readonly<{ profile: Profile }>) {
    return (
        <p className="text-shadow-600 text-center">
            You have not written any articles.{" "}
            {props.profile.role === "ADMIN" ? (
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
        </p>
    )
}

function NoSuggestionsMadeMessage() {
    return (
        <p className="text-shadow-600 text-center">
            You have not made any suggestions yet. Make one{" "}
            <Link
                href="/suggestions/write"
                className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline">
                here!
            </Link>
        </p>
    )
}

export default async function DashboardHomePage({ params }: Readonly<DashboardHomePageProps>) {
    const username = (await params).username
    if (!username) return notFound()

    const [profileState, dashboardState] = await Promise.all([getOwnProfile(), getOwnDashboard()])
    if (!profileState.ok || !dashboardState.ok) return redirect("/auth/login")

    const profile = profileState.response?.data as Profile
    const dashboard = dashboardState.response?.data as Dashboard
    if (profile.username !== username) return notFound()

    const latestWrittenArticle = dashboard.latestWrittenArticle
    const latestThreeSuggestionsList = Array.from(dashboard.latestThreeSuggestions)
    const latestThreeCommentsList = Array.from(dashboard.latestThreeComments)

    const isAdmin = profile.role === "ADMIN"

    return (
        <>
            <nav className="my-6 rounded-md bg-stone-200 px-6 py-2.5 sm:px-3.5">
                <div role="list" className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        <LinkButton
                            href={`/dashboard/${username}/notifications`}
                            aria-label="List all my notifications"
                            title="List all my notifications"
                            buttonStyle="ghost">
                            <span className="hidden sm:block">Notifications</span>
                            <LuMailbox aria-hidden="true" className="block size-4 text-inherit sm:hidden" />
                        </LinkButton>

                        {isAdmin && (
                            <>
                                <LinkButton
                                    href={`/dashboard/${username}/articles`}
                                    aria-label="List all my articles"
                                    title="List all my articles"
                                    buttonStyle="ghost">
                                    <span className="hidden sm:block">Articles</span>
                                    <LuNewspaper aria-hidden="true" className="block size-4 text-inherit sm:hidden" />
                                </LinkButton>

                                <LinkButton
                                    href={`/dashboard/${username}/notices`}
                                    aria-label="List all notices issued by me"
                                    title="List all notices issued by me"
                                    buttonStyle="ghost">
                                    <span className="hidden sm:block">Notices</span>
                                    <LuInfo aria-hidden="true" className="block size-4 text-inherit sm:hidden" />
                                </LinkButton>

                                <LinkButton
                                    href={`/dashboard/${username}/users`}
                                    aria-label="List all platform users"
                                    title="List all platform users"
                                    buttonStyle="ghost">
                                    <span className="hidden sm:block">Users</span>
                                    <LuUserSearch aria-hidden="true" className="block size-4 text-inherit sm:hidden" />
                                </LinkButton>
                            </>
                        )}
                    </div>

                    <div className="inline-flex items-center gap-x-2">
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            <div className="mt-2 mb-8 grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-[33%_auto] lg:gap-8">
                <aside className="grid gap-y-2 *:rounded-md *:border-2 *:border-stone-200 *:p-4 sm:gap-y-4 lg:gap-y-8">
                    <DashboardUserProfile name={username} profile={profile} />

                    <DashboardSiteInteractions dashboard={dashboard} />
                </aside>

                <main className="flex flex-col gap-y-4 rounded-md border-2 border-stone-200 p-4 sm:gap-y-8">
                    <section aria-labelledby="section-latest-article-title" className="grid gap-y-4">
                        <h2 id="section-latest-article-title" className="text-shadow-900 border-b-2 font-medium">
                            Latest Published Article
                        </h2>
                        {!latestWrittenArticle && <NoWrittenArticleMessage profile={profile} />}
                        {latestWrittenArticle && <DashboardLatestWrittenArticle article={latestWrittenArticle} />}
                    </section>

                    <section aria-labelledby="section-suggestions-made-title" className="grid gap-y-4">
                        <h2 id="section-suggestions-made-title" className="text-shadow-900 border-b-2 font-medium">
                            Latest Suggestions Made
                        </h2>
                        {latestThreeSuggestionsList.length <= 0 && <NoSuggestionsMadeMessage />}
                        {latestThreeSuggestionsList.length > 0 && (
                            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {latestThreeSuggestionsList.map(suggestion => (
                                    <DashboardLatestSuggestionMade key={suggestion.id} suggestion={suggestion} />
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-labelledby="section-latest-comments-title" className="grid gap-y-4">
                        <h2 id="section-latest-comments-title" className="text-shadow-900 border-b-2 font-medium">
                            Latest Written Comments
                        </h2>
                        {latestThreeCommentsList.length <= 0 && (
                            <p className="text-shadow-600 text-center">You have not written any comments yet.</p>
                        )}

                        {latestThreeCommentsList.length > 0 && (
                            <ul className="grid gap-y-4 divide-y divide-stone-200">
                                {latestThreeCommentsList.map(comment => (
                                    <DashboardLatestCommentMade key={comment.id} comment={comment} />
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
}
