export default function CommentSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="mb-6 max-w-3xl space-y-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="flex animate-pulse rounded-md border border-stone-200 p-4 shadow">
                    <div className="shrink-0">
                        <span className="block size-12 rounded-full bg-stone-400 dark:bg-stone-700"></span>
                    </div>

                    <div className="ms-4 mt-2 w-full">
                        <p className="h-4 w-1/3 rounded-full bg-stone-400 dark:bg-stone-700"></p>

                        <ul className="mt-5 space-y-3">
                            <li className="h-4 w-full rounded-full bg-stone-200 dark:bg-stone-700"></li>
                            <li className="h-4 w-full rounded-full bg-stone-200 dark:bg-stone-700"></li>
                            <li className="h-4 w-full rounded-full bg-stone-200 dark:bg-stone-700"></li>
                            <li className="h-4 w-full rounded-full bg-stone-200 dark:bg-stone-700"></li>
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    )
}
