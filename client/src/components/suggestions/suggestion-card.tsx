import { Suggestion } from "@/@types/suggestions"
import LinkButton     from "@/components/shared/link-button"
import Image          from "next/image"

interface SuggestionCardProps {
    suggestion: Suggestion
}

export default function SuggestionCard({ suggestion }: Readonly<SuggestionCardProps>) {
    return (
        <article className="grid grid-cols-1 gap-4 rounded-md border border-stone-200 p-4 md:grid-cols-2 lg:grid-cols-[auto_1fr_auto]">
            <div className="relative h-40 w-full md:h-48 md:w-72">
                <Image
                    src={ suggestion.mediaUrl }
                    alt="Preview of the suggestion"
                    title="Preview of the suggestion"
                    className="h-auto w-full rounded-md object-cover"
                    sizes="(min-width: 808px) 50vw, 100vw"
                    quality={ 75 }
                    fill
                />
            </div>

            <div className="flex w-full max-w-prose flex-col gap-y-2">
                <h2 className="text-shadow-900 text-xl font-semibold tracking-tight text-pretty sm:text-3xl">
                    { suggestion.title }
                </h2>
                <p className="text-shadow-600 mt-2 text-lg">{ suggestion.content }</p>
            </div>

            <div className="grid content-between gap-4">
                <div className="w-max space-y-2">
                    <time dateTime={ String(suggestion.createdAt) } className="text-shadow-300 text-sm">
                        { new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) }
                    </time>
                    <p className="text-shadow-400">
                        Suggested by <span className="font-semibold">{ suggestion.user.username }</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <LinkButton
                        href={ `/articles/write?suggestion=${ suggestion.id }&title=${ suggestion.title }` }
                        aria-label="Start writing your suggestions"
                        buttonStyle="colored">
                        Write about it
                    </LinkButton>

                    <LinkButton
                        href={ suggestion.sourceUrl }
                        aria-label={ `Read the source for  '${ suggestion.title }' ` }
                        title={ `Read the source for  '${ suggestion.title }' ` }
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        buttonStyle="ghost">
                        Read source <span aria-hidden="true">&rarr;</span>
                    </LinkButton>
                </div>
            </div>
        </article>
    )
}
