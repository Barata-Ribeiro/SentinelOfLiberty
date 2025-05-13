export default function TextEditorSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="mx-auto mb-4 rounded-md border border-stone-200 p-4 dark:border-transparent dark:bg-stone-900">
            <div className="grid w-full gap-y-4">
                <div className="h-10 animate-pulse rounded-md bg-stone-400 dark:bg-stone-800"></div>
                <div className="min-h-96 animate-pulse rounded-md bg-stone-400 dark:bg-stone-800"></div>
            </div>
        </div>
    )
}
