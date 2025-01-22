import { auth }     from "auth"
import { Metadata } from "next"
import Link         from "next/link"

export const metadata: Metadata = {
    title: "404 - Not Found",
    description: "This page does not exist.",
}

export default async function NotFoundPage() {
    const session = await auth()
    
    return (
        <main className="isolate grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-marigold-600">404</p>
                <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-shadow-900 sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-pretty text-lg font-medium text-shadow-500 sm:text-xl/8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <Link
                        href="/"
                        className="rounded-md bg-marigold-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-marigold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600 active:bg-marigold-700">
                        Go back home
                    </Link>
                    <Link
                        href={ session ? `/dashboard/${ session.user.username }` : "/auth/login" }
                        className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-shadow-900 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 active:bg-stone-200">
                        { session ? (
                            <>
                                Your Dashboard <span aria-hidden="true">&rarr;</span>
                            </>
                        ) : (
                              <>
                                Login <span aria-hidden="true">&rarr;</span>
                            </>
                          ) }
                    </Link>
                </div>
            </div>
        </main>
    )
}
