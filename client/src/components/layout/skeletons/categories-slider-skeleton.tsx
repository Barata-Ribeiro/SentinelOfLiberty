export default function CategoriesSliderSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="w-full border-y border-stone-200 py-2">
            <div className="h-8 w-full animate-pulse rounded bg-stone-400" />
        </div>
    )
}
