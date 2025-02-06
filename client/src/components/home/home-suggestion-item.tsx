import { Suggestion } from "@/@types/suggestions"
import Image          from "next/image"
import Link           from "next/link"

interface HomeSuggestionItemProps {
    suggestion: Suggestion
}

export default function HomeSuggestionItem({ suggestion }: HomeSuggestionItemProps) {
    return (
        <li className="flex items-center gap-2 rounded-lg border-2 border-stone-200 p-2">
            <Image
                src={ suggestion.mediaUrl }
                alt={ `Image of original news: ${ suggestion.title }` }
                title={ `Image of original news: ${ suggestion.title }` }
                width={ 100 }
                height={ 100 }
                quality={ 50 }
                className="size-24 rounded-md object-cover object-center"
            />

            <div className="grid w-fit">
                <time dateTime={ String(suggestion.createdAt) } className="text-shadow-600 text-sm">
                    { new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }) }
                </time>
                <Link
                    href={ suggestion.sourceUrl }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700">
                    <h2 className="max-w-[35ch]">{ suggestion.title }</h2>
                </Link>
                <p className="text-shadow-300 text-sm">Suggested by { suggestion.user.username }</p>
            </div>
        </li>
    )
}
