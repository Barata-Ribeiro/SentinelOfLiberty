import { Suggestion } from "@/@types/suggestions"
import Image from "next/image"
import Link from "next/link"

interface MainArticleSuggestionProps {
    suggestion?: Suggestion
}

export default function MainArticleSuggestion({ suggestion }: Readonly<MainArticleSuggestionProps>) {
    if (!suggestion) return null

    return (
        <div className="grid grid-cols-1 gap-y-2 divide-y divide-stone-100">
            <h3 className="text-shadow-900 text-xl">Based on Suggestion</h3>
            <Link
                href={suggestion.sourceUrl}
                aria-label={`Suggestion: ${suggestion.title}`}
                title={`Suggestion: ${suggestion.title}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group relative grid h-max w-max max-w-[35ch] p-4 text-balance">
                <Image
                    src={suggestion.mediaUrl}
                    alt={`Image of original news: ${suggestion.title}`}
                    title={`Image of original news: ${suggestion.title}`}
                    fill
                    quality={50}
                    className="rounded-md object-cover object-center shadow-sm grayscale-100 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md group-active:scale-95 group-active:shadow-lg"
                />
                <h4 className="text-shadow-200 group-hover:text-shadow-300 group-active:text-shadow-400 relative min-w-0 text-base font-semibold group-hover:underline">
                    {suggestion.title}
                </h4>
                <p className="prose prose-sm text-shadow-50 relative">{suggestion.content}</p>
            </Link>
        </div>
    )
}
