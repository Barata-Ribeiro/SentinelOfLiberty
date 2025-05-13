import { Suggestion } from "@/@types/suggestions"
import getSuggestionById from "@/actions/suggestions/get-suggestion-by-id"
import Image from "next/image"
import Link from "next/link"

interface ArticleSuggestionCardProps {
    suggestionId: number
}

export default async function ArticleSuggestionCard({ suggestionId }: Readonly<ArticleSuggestionCardProps>) {
    const suggestionState = await getSuggestionById({ id: suggestionId })
    const suggestion = suggestionState.response?.data as Suggestion

    return (
        <section
            className="group mx-auto mb-4 max-w-2xl rounded-md border border-stone-200 p-4 transition-colors duration-200 ease-in-out hover:bg-stone-100"
            aria-labelledby="suggestion-title"
            aria-describedby="suggestion-content">
            <Link
                href={suggestion.sourceUrl}
                aria-label={`Read the full article: ${suggestion.title}`}
                title={`Read the full article: ${suggestion.title}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="grid grid-cols-1 content-center gap-4 md:grid-cols-[1fr_auto]">
                <div className="relative h-72 w-full md:size-40">
                    <Image
                        src={suggestion.mediaUrl}
                        alt="Preview"
                        quality={50}
                        fill
                        className="aspect-square rounded-md object-cover"
                    />
                </div>

                <div className="grid gap-y-2">
                    <h2
                        id="suggestion-title"
                        className="text-shadow-900 text-xl font-semibold tracking-tight text-pretty">
                        {suggestion.title}
                    </h2>
                    <p id="suggestion-content" className="text-shadow-600 prose">
                        {suggestion.content}
                    </p>
                </div>
            </Link>
        </section>
    )
}
