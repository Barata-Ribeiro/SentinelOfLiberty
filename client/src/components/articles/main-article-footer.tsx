import { Article }                                        from "@/@types/articles"
import Link                                               from "next/link"
import { FaLinkedin, FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6"

interface MainArticleFooterProps {
    article: Article
    pathname: string | null
}

export default function MainArticleFooter({ article, pathname }: Readonly<MainArticleFooterProps>) {
    return (
        <footer className="mt-8 space-y-4 divide-y divide-stone-100">
                            <div className="flex flex-wrap items-center gap-4 pb-4">
                                { Array.from(article.categories).map(category => (
                                    <Link
                                        key={ `category-${ category.id }-${ category.name }` }
                                        href={ `/articles/category/${ category.name }` }
                                        aria-label={ `Category ${ category.name }` }
                                        title={ `Category ${ category.name }` }
                                        className="text-shadow-700 focus-visible:outline-marigold-600 hover:text-shadow-900 active:text-shadow-800 rounded bg-stone-100 px-2 py-1 capitalize transition duration-200 select-none hover:bg-stone-300 focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-stone-200">
                                        { category.name }
                                    </Link>
                                )) }
                            </div>

                            <div className="flex items-center gap-x-2">
                                <span className="text-shadow-500 text-sm">Share:</span>
                                <Link
                                    href={ `https://x.com/intent/tweet/?url=${ article.title }&url=${ pathname }` }
                                    aria-label="Share on X"
                                    title="Share on X"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaSquareXTwitter aria-hidden="true" className="size-8" />
                                </Link>
                                <Link
                                    href={ `https://www.facebook.com/sharer/sharer.php?u=${ pathname }` }
                                    aria-label="Share on Facebook"
                                    title="Share on Facebook"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaSquareFacebook aria-hidden="true" className="size-8" />
                                </Link>
                                <Link
                                    href={ `https://www.linkedin.com/shareArticle?url=${ pathname }` }
                                    aria-label="Share on LinkedIn"
                                    title="Share on LinkedIn"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800">
                                    <FaLinkedin aria-hidden="true" className="size-8" />
                                </Link>
                            </div>
                        </footer>
    )
}