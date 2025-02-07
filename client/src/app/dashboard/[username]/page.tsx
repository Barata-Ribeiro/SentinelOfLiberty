import { Dashboard, Profile }        from "@/@types/user"
import getOwnDashboard               from "@/actions/users/get-own-dashboard"
import getOwnProfile                 from "@/actions/users/get-own-profile"
import DashboardLatestWrittenArticle from "@/components/dashboard/dashboard-latest-written-article"
import DashboardSiteInteractions     from "@/components/dashboard/dashboard-site-interactions"
import DashboardUserProfile          from "@/components/dashboard/dashboard-user-profile"
import Link                          from "next/link"
import { notFound }                  from "next/navigation"

interface DashboardHomePageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Readonly<DashboardHomePageProps>) {
    const username = (await params).username
    return {
        title: `${ username }`,
        description: "This is the dashboard home page",
    }
}

function NoWrittenArticleMessage(props: { profile: Profile }) {
    return (
        <p className="text-shadow-600 text-center">
            You have not written any articles.{ " " }
            { props.profile.role === "ADMIN" ? (
                <>
                    Write one now{ " " }
                    <Link
                        href="/articles/write"
                        className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline">
                        here!
                    </Link>
                </>
            ) : (
                  "Wait for one of our creators to write one."
              ) }
        </p>
    )
}

export default async function DashboardHomePage({ params }: Readonly<DashboardHomePageProps>) {
    const username = (await params).username
    if (!username) return notFound()
    
    const profilePromise = getOwnProfile()
    const dashboardPromise = getOwnDashboard()
    
    const [ profileState, dashboardState ] = await Promise.all([ profilePromise, dashboardPromise ])
    if (!profileState.ok || !dashboardState.ok) return notFound()
    
    const profile = profileState.response?.data as Profile
    const dashboard = dashboardState.response?.data as Dashboard
    
    console.group("DashboardHomePage")
    console.log("username: ", username)
    console.log("profile: ", profile)
    console.log("dashboard: ", dashboard)
    console.groupEnd()
    
    const latestWrittenArticle = dashboard.latestWrittenArticle
    
    return (
        <div className="my-8 grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-[33%_66%] lg:gap-8">
            <aside className="grid gap-y-2 *:rounded-md *:border-2 *:border-stone-200 *:p-4 sm:gap-y-4 lg:gap-y-8">
                <DashboardUserProfile name={ username } profile={ profile } />

                <DashboardSiteInteractions dashboard={ dashboard } />
            </aside>

            <main className="rounded-md border-2 border-stone-200 p-4">
                <div className="grid gap-y-4">
                    <h2 className="text-shadow-900 border-b-2 font-medium">Latest Written Article</h2>
                    { !latestWrittenArticle && <NoWrittenArticleMessage profile={ profile } /> }
                    { latestWrittenArticle && <DashboardLatestWrittenArticle article={ latestWrittenArticle } /> }
                </div>
            </main>
        </div>
    )
}
