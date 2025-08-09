import Spinner from "@/components/helpers/spinner"

export default function ProfileArticlesWrittenListSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="mx-auto w-full max-w-2xl">
            <ul className="grid gap-6">
                {[...Array(3)].map((_, idx) => (
                    <li
                        key={idx}
                        className="group flex animate-pulse flex-col gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:flex-row">
                        <div className="relative flex w-full flex-shrink-0 items-center justify-center overflow-hidden rounded bg-stone-100 max-md:h-28 md:max-w-28">
                            <div className="size-20 rounded bg-stone-300 dark:bg-stone-700" />
                        </div>
                        <article className="flex flex-1 flex-col">
                            <header className="mb-2">
                                <div className="mb-2 h-5 w-2/3 rounded bg-stone-400 dark:bg-stone-700" />
                                <div className="h-3 w-1/2 rounded bg-stone-200 dark:bg-stone-700" />
                            </header>
                            <div className="mb-2 flex items-center justify-between text-xs">
                                <div className="h-3 w-1/3 rounded bg-stone-200 dark:bg-stone-700" />
                                <div className="h-3 w-12 rounded bg-stone-200 dark:bg-stone-700" />
                            </div>
                            <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-700" />
                        </article>
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-center py-6">
                <p className="inline-flex animate-pulse items-center gap-x-2" aria-label="Loading articles...">
                    <Spinner /> Loading Articles...
                </p>
            </div>
        </div>
    )
}
