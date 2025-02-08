import { Suggestion } from "@/@types/suggestions"
import Link           from "next/link"

interface DashboardLatestSuggestionMadeProps {
    suggestion: Suggestion
}

export default function DashboardLatestSuggestionMade({ suggestion }: DashboardLatestSuggestionMadeProps) {
    return (
        <li>
            <time dateTime={ String(suggestion.createdAt) } className="text-shadow-300 text-sm">
                { new Date(suggestion.createdAt)
                    .toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    .replace(/\//g, " \u00B7 ") }
            </time>
            <h3
                aria-label={ `Read source: ${ suggestion.title }` }
                title={ `Read source: ${ suggestion.title }` }
                className="text-shadow-900 hover:text-marigold-500 active:text-marigold-700 truncate text-lg font-medium hover:underline">
                <Link href={ suggestion.sourceUrl } rel="noopener noreferrer external" target="_blank">
                    { suggestion.title }
                </Link>
            </h3>
            <p className="prose prose-sm text-shadow-900">{ suggestion.content }</p>
        </li>
    )
}
