import Link from "next/link"
import { FaLink } from "react-icons/fa6"

interface MainArticleReferencesProps {
    references: string[]
}

export default function MainArticleReferences({ references }: Readonly<MainArticleReferencesProps>) {
    return (
        <div className="grid grid-cols-1 gap-y-2 divide-y divide-stone-100">
            <h3 className="text-shadow-900 mt-0 text-xl md:mt-4">References</h3>
            {references.map((reference, index) => (
                <div key={`reference-${index + Math.random()}`} className="flex w-max items-center justify-between p-4">
                    <Link
                        href={reference}
                        aria-label={`Reference to ${reference}`}
                        title={`Reference to ${reference}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-shadow-400 hover:text-shadow-500 active:text-shadow-600 flex min-w-0 items-center gap-x-2 text-sm hover:underline max-sm:max-w-[2rem]">
                        <span className="shrink-0 rounded-full bg-yellow-100 p-2">
                            <FaLink aria-hidden="true" className="size-4" />
                        </span>
                        {reference.length > 30 ? `${reference.substring(0, 30)}...` : reference}
                    </Link>
                </div>
            ))}
        </div>
    )
}
