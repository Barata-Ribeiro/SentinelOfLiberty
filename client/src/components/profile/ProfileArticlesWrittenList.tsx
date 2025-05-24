import { Paginated } from "@/@types/application"
import { ArticleSummary } from "@/@types/articles"
import getAllPublicArticlesByAuthorPaginated from "@/actions/articles/get-all-public-articles-by-author-paginated"
import Link from "next/link"

interface ProfileArticlesWrittenListProps {
    username: string
}

export default async function ProfileArticlesWrittenList({ username }: Readonly<ProfileArticlesWrittenListProps>) {
    const state = await getAllPublicArticlesByAuthorPaginated({
        username,
        page: 0,
        perPage: 25,
        direction: "DESC",
        orderBy: "createdAt",
    })

    const pagination = state.response?.data as Paginated<ArticleSummary>
    const content = pagination.content ?? []

    console.log("ProfileArticlesWrittenList content:", content)

    // TODO: Add infinite scrolling
    // TODO: Handle empty state

    return (
        <ul>
            {content.map(article => (
                <li key={article.id} className="mb-4">
                    <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                        {article.title}
                    </Link>
                    <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>
    )
}
