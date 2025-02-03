import LinkButton   from "@/components/shared/link-button"
import { auth }     from "auth"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "404 - Not Found",
    description: "This page does not exist.",
}

export default async function NotFoundPage() {
    const session = await auth()
    
    return (
        <main className="isolate grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-marigold-600 text-base font-semibold">404</p>
                <h1 className="text-shadow-900 mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                    Page not found
                </h1>
                <p className="text-shadow-500 mt-6 text-lg font-medium text-pretty sm:text-xl/8">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <LinkButton
                        href="/"
                        className="bg-marigold-600 text-marigold-50 hover:bg-marigold-500 active:bg-marigold-700 px-3.5 py-2.5 shadow-xs">
                        Go back home
                    </LinkButton>
                    <LinkButton
                        href={ session ? `/dashboard/${ session.user.username }` : "/auth/login" }
                        className="text-shadow-900 hover:text-shadow-800 active:text-shadow-700 px-3.5 py-2.5 hover:bg-stone-100 active:bg-stone-200">
                        { session ? (
                            <>
                                Your Dashboard <span aria-hidden="true">&rarr;</span>
                            </>
                        ) : (
                              <>
                                Login <span aria-hidden="true">&rarr;</span>
                            </>
                          ) }
                    </LinkButton>
                </div>
            </div>
        </main>
    )
}
