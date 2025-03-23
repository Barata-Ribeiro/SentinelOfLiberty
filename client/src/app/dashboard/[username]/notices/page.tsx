import { Paginated }                   from "@/@types/application"
import { Notice }                      from "@/@types/notices"
import getAllOwnIssuedNoticesPaginated from "@/actions/notices/get-all-own-issued-notices-paginated"
import NoticeStatusSwitch              from "@/components/dashboard/notice/notice-status-switch"
import DeleteNoticeModal               from "@/components/modals/delete-notice-modal"
import EditNoticeModal                 from "@/components/modals/edit-notice-modal"
import NewNoticeModal                  from "@/components/modals/new-notice-modal"
import NavigationPagination            from "@/components/shared/navigation-pagination"
import { auth }                        from "auth"
import { Metadata }                    from "next"
import Link                            from "next/link"
import { permanentRedirect }           from "next/navigation"
import { LuChevronDown, LuChevronUp }  from "react-icons/lu"

interface NoticesPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "My Notices",
    description: "Listing all the notices issued by you on this platform.",
}

function TableHeader(
    props: Readonly<{
        href: string
        direction: string
        orderBy: string
        href1: string
        href2: string
    }>,
) {
    return (
        <thead>
            <tr>
                <th scope="col" className="text-shadow-900 py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-0">
                    <Link href={ props.href } className="group inline-flex">
                        Id{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "id" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href1 } className="group inline-flex">
                        Title{ " " }
                        <span className="text-shadow-900 ml-2 flex-none rounded-sm bg-stone-100 group-hover:bg-stone-200">
                            { props.direction === "ASC" && props.orderBy === "title" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    Message
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href2 } className="group inline-flex">
                        Status{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "isActive" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="relative py-3.5 pr-0 pl-3">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
    )
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
    
    const baseUrl = `/dashboard/${ username }/notices`
    
    function buildUrl(item: string, direction: string) {
        let orderUrl = `${ baseUrl }?orderBy=${ item }`
        if (direction === "ASC") orderUrl += "&direction=ASC"
        return orderUrl
    }
    
    return (
        <div
            className="flex h-full min-h-0 flex-col justify-between"
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

            <main className="mt-8 flow-root h-full border-t border-stone-200 pt-8">
                <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-stone-300">
                            <TableHeader
                                href={ buildUrl("id", orderBy === "id" && direction === "ASC" ? "DESC" : "ASC") }
                                direction={ direction }
                                orderBy={ orderBy }
                                href1={ buildUrl("title", orderBy === "title" && direction === "ASC" ? "DESC" : "ASC") }
                                href2={ buildUrl(
                                    "isActive",
                                    orderBy === "isActive" && direction === "ASC" ? "DESC" : "ASC",
                                ) }
                            />

                            <tbody className="divide-y divide-stone-200 bg-white">
                                { content.map(notice => (
                                    <tr key={ notice.id }>
                                        <td className="text-shadow-900 py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-0">
                                            { notice.id }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            { notice.title ?? "N/A" }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            { notice.message }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            <NoticeStatusSwitch isActive={ notice.isActive } />
                                        </td>
                                        <td className="relative inline-flex gap-x-2 py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-0">
                                            <EditNoticeModal notice={ notice } />

                                            <DeleteNoticeModal id={ notice.id } title={ notice.title } />
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </div>
                </div>
                
                { pagination.page.totalElements <= 0 && (
                    <div className="flex h-96 items-center justify-center">
                        <p className="text-shadow-500 text-lg">No notices issued.</p>
                    </div>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination.page } />
        </div>
    )
}
