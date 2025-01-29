export default function HeaderAvatarSkeleton() {
    return (
        <div className="flex items-center gap-3" aria-hidden="true">
            <div className="size-7 animate-pulse rounded-full bg-stone-400 shrink-0 focus:outline-2 focus:outline-offset-2"></div>
            <div className="size-9 animate-pulse rounded-full bg-stone-600 shrink-0 ring-2 ring-white"></div>
            <div className="grid gap-y-2">
                <div className="h-3 w-20 animate-pulse rounded-md bg-stone-400"></div>
                <div className="h-2 w-12 animate-pulse rounded-md bg-stone-200"></div>
            </div>
        </div>
    )
}
