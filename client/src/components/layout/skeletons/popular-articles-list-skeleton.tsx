export default function PopularArticlesListSkeleton() {
    return (
        <ul
            role="status"
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-1"
            aria-label="Loading in progress... Please wait.">
            {[...Array(3)].map((_, index) => (
                <li key={index} className="grid max-w-96 animate-pulse grid-cols-1 gap-2">
                    <div className="relative min-h-48">
                        <div className="size-48 rounded-md bg-stone-600"></div>
                        <div className="absolute inset-0 h-8 w-1/2 rounded-tl-md rounded-br-lg bg-stone-800"></div>
                    </div>
                    <div className="my-2 space-y-2">
                        <div className="h-4 w-3/4 rounded-md bg-stone-400"></div>
                        <div className="h-4 w-1/2 rounded-md bg-stone-400"></div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
