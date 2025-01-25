import { Dashboard, Profile } from "@/@types/user"
import getOwnDashboard        from "@/actions/users/get-own-dashboard"
import getOwnProfile          from "@/actions/users/get-own-profile"
import Avatar                 from "@/components/avatar"
import { Button }             from "@headlessui/react"
import { notFound }           from "next/navigation"

interface DashboardHomePageProps {
    params: Promise<{ username: string }>
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
    
    return (
        <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-[33%_66%]">
            <aside className="grid gap-y-8 *:rounded-md *:border-2 *:border-stone-200 *:p-4">
                <div className="grid place-items-center gap-y-4">
                    <Avatar name={ username } size={ 96 } src={ profile.avatarUrl } />

                    <div className="text-center text-balance">
                        <h1 className="text-shadow-900 text-2xl font-bold">{ profile.displayName }</h1>
                        <h2 className="text-shadow-300 text-sm font-medium">{ profile.email }</h2>
                    </div>

                    <time dateTime={ profile.createdAt } className="text-shadow-500 text-sm">
                        Member since{ " " }
                        { new Date(profile.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        }) }
                    </time>
                    
                    { profile.roles === "ADMIN" ? (
                        <span
                            className="mt-2 rounded-full border border-red-400 bg-red-100 px-2.5 py-1 text-xs leading-none font-medium text-red-800 select-none dark:bg-red-900 dark:text-red-300"
                            aria-label="You are an admin">
                            Admin
                        </span>
                    ) : (
                          <span
                              className="mt-2 rounded-full border border-stone-500 bg-stone-100 px-2.5 py-1 text-xs leading-none font-medium text-stone-800 select-none"
                              aria-label="You are a reader">
                            Reader
                        </span>
                      ) }
                    
                    <div className="mt-4 flex space-x-3 lg:mt-6">
                        <Button
                            type="button"
                            className="bg-marigold-600 hover:bg-marigold-700 active:bg-marigold-800 focus:ring-marigold-200 text-marigold-50 inline-flex cursor-pointer items-center rounded-lg px-4 py-2 text-center text-sm font-medium select-none focus:ring-4 focus:outline-none"
                            aria-label="Edit profile">
                            Edit Profile
                        </Button>

                        <Button
                            type="button"
                            className="text-shadow-900 focus:ring-marigold-200 inline-flex cursor-pointer items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-center text-sm font-medium select-none hover:bg-stone-100 focus:ring-4 focus:outline-none active:bg-stone-200"
                            aria-label="Check account details">
                            Account Details
                        </Button>
                    </div>
                    <div className="mt-5 border-t-2 border-stone-100 pt-3">
                        <h3 className="text-shadow-900 mb-2 text-center text-xl font-medium">Biography</h3>
                        <p className="text-shadow-600 text-center text-sm">
                            { profile.biography ?? "No biography yet. Edit you profile above!!" }
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-shadow-900 mb-2 self-center text-xl font-medium">Site Interactions</h3>
                    <ul className="list-disc space-y-2 pl-5">
                        <li className="font-medium">
                            Suggestions Made:
                            <span className="font-normal">{ dashboard.totalWrittenSuggestions }</span>
                        </li>
                        <li className="font-medium">
                            Articles Published:
                            <span className="font-normal">{ dashboard.totalWrittenArticles }</span>
                        </li>
                        <li className="font-medium">
                            Comments Written:
                            <span className="font-normal">{ dashboard.totalWrittenComments }</span>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className="rounded-md border-2 border-stone-200 p-4"></main>
        </div>
    )
}
