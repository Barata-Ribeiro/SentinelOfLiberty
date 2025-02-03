export default function HeaderAvatarSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait." className="flex items-center gap-3">
            <div
                aria-hidden="true"
                className="size-7 shrink-0 animate-pulse rounded-full bg-stone-400 focus:outline-2 focus:outline-offset-2"></div>
            <div
                aria-hidden="true"
                className="size-9 shrink-0 animate-pulse rounded-full bg-stone-600 ring-2 ring-white"></div>
            <div aria-hidden="true" className="grid gap-y-2">
                <div className="h-3 w-20 animate-pulse rounded-md bg-stone-400"></div>
                <div className="h-2 w-12 animate-pulse rounded-md bg-stone-200"></div>
            </div>
        </div>
    )
}
