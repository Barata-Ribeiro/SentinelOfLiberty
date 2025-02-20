import { Paginated }                   from "@/@types/application"
import { Notice }                      from "@/@types/notices"
import getAllOwnIssuedNoticesPaginated from "@/actions/notices/get-all-own-issued-notices-paginated"
import NewNoticeModal                  from "@/components/modals/new-notice-modal"
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
    
    return (
        <div className="flex flex-col justify-between h-full"
             aria-labelledby="page-title"
             aria-describedby="page-description">
            <header className="mt-4 sm:mt-8">
                <div className="flex flex-wrap items-center justify-between">
                    <h1
                        id="page-title"
                        className="text-shadow-900 block text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                        Notices
                    </h1>

                    <NewNoticeModal />
                </div>

                <p id="page-description" className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.page.totalElements } notices(s) issued by you. Manage them here.
                </p>
            </header>
            
            <main className="mt-8 -mb-4 h-full flow-root border-t border-stone-200 pt-8">
                { content.length <= 0 && (
                    <div className="flex h-96 items-center justify-center">
                            <p className="text-shadow-500 text-lg">No notifications available.</p>
                        </div>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination.page } />
        </div>
    )
}
