import { Paginated }                   from "@/@types/application"
import { Notice }                      from "@/@types/notices"
import getAllOwnIssuedNoticesPaginated from "@/actions/notices/get-all-own-issued-notices-paginated"
import NavigationPagination            from "@/components/shared/navigation-pagination"
import { auth }                        from "auth"
import { Metadata }                    from "next"
import { permanentRedirect }           from "next/navigation"

interface NoticesPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "My Notices",
    description: "Listing all the notices issued by you on this platform.",
}

export default async function NoticesPage({ params, searchParams }: Readonly<NoticesPageProps>) {
    const [ session, { username }, pageParams ] = await Promise.all([ auth(), params, searchParams ])
    if (!pageParams) return null
    
    if (!session || !username || session?.user.role !== "ADMIN" || session?.user.username !== username) {
        return permanentRedirect("/")
    }
    
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as string) || "DESC"
    const orderBy = (pageParams.orderBy as string) || "createdAt"
    
    const noticeState = await getAllOwnIssuedNoticesPaginated({ page, perPage, direction, orderBy })
    const pagination = noticeState.response?.data as Paginated<Notice>
    const content = pagination.content ?? []
    
    console.log("STATE: ", noticeState)
    
    return (
        <div className="container" aria-labelledby="page-title" aria-describedby="page-description">
            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
