import getAllPublicArticlesByAuthorPaginated from "@/actions/articles/get-all-public-articles-by-author-paginated"
import ProfileArticlesWrittenList from "@/components/profile/profile-articles-written-list"
import ProfileArticlesWrittenListSkeleton from "@/components/layout/skeletons/profile-articles-written-list-skeleton"
import { Suspense } from "react"

interface ProfileArticlesWrittenListProps {
    username: string
}

export default async function ProfileArticlesWritten({ username }: Readonly<ProfileArticlesWrittenListProps>) {
    const state = getAllPublicArticlesByAuthorPaginated({
        username,
        page: 0,
        perPage: 25,
        direction: "DESC",
        orderBy: "createdAt",
    })

    return (
        <Suspense fallback={<ProfileArticlesWrittenListSkeleton />}>
            <ProfileArticlesWrittenList articlesPromise={state} />
        </Suspense>
    )
}
