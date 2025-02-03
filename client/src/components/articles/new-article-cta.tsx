import LinkButton       from "@/components/shared/link-button"
import Image            from "next/image"
import articlePagePhoto from "../../../public/articles-page-photo.jpg"

export default function NewArticleCta() {
    return (
        <div className="relative isolate overflow-hidden bg-stone-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
                <circle r={ 512 }
                        cx={ 512 }
                        cy={ 512 }
                        fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                        fillOpacity="0.7" />
                <defs>
                    <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                        <stop stopColor="#ddb115" />
                        <stop offset={ 1 } stopColor="#f3dd51" />
                    </radialGradient>
                </defs>
            </svg>

            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 className="text-shadow-100 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    Start writing your articles
                </h2>
                <p className="text-shadow-300 mt-6 text-lg/8 text-pretty">
                    Share your knowledge and experiences with the world. Start writing your articles today and get them
                    published on our platform.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row lg:justify-start">
                    <LinkButton
                        href="/articles/write"
                        aria-label="Start writing your articles"
                        className="bg-marigold-600 text-marigold-50 hover:bg-marigold-500 active:bg-marigold-700 px-3.5 py-2.5 shadow-xs">
                        Get started
                    </LinkButton>
                    <LinkButton
                        href="/articles/rules"
                        aria-label="Learn more about the rules for writing articles"
                        className="text-shadow-100 hover:text-shadow-200 active:text-shadow-300 active:bg-marigold-700 px-3.5 py-2.5">
                        Learn more <span aria-hidden="true">&rarr;</span>
                    </LinkButton>
                </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
                <Image
                    alt="Person using MacBook Pro photo. Photo by @glenncarstenspeters on Unsplash"
                    src={ articlePagePhoto }
                    className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md border border-stone-900 bg-stone-500 ring-2 ring-offset-stone-50 brightness-90 grayscale-50"
                />
            </div>
        </div>
    )
}
