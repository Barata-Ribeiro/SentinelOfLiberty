import { FaImage } from "react-icons/fa6"

export default function ArticleSuggestionCardSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading in progress... Please wait."
            className="mx-auto mb-4 max-w-2xl rounded-md border border-stone-200 p-4 dark:border-transparent dark:bg-stone-900">
            <div className="animate-pulse space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4 rtl:space-x-reverse">
                <div className="flex h-40 w-full items-center justify-center rounded-sm bg-stone-300 md:w-96 dark:bg-stone-700">
                    <FaImage aria-hidden="true" className="size-10 text-stone-100 dark:text-stone-600" />
                </div>

                <div className="w-full">
                    <div className="mb-4 h-4 max-w-48 rounded-full bg-stone-400 dark:bg-stone-800"></div>
                    <div className="mb-2.5 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></div>
                    <div className="mb-2.5 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></div>
                    <div className="mb-2.5 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></div>
                    <div className="mb-2.5 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></div>
                    <div className="h-2 max-w-30 rounded-full bg-stone-200 sm:max-w-60 dark:bg-stone-700"></div>
                </div>
            </div>
        </div>
    )
}
