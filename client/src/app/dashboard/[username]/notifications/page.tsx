import { Paginated }                from "@/@types/application"
import { Notification }             from "@/@types/user"
import getAllNotificationsPaginated from "@/actions/notifications/get-all-notifications-paginated"
import DashboardNotificationTable   from "@/components/dashboard/dashboard-notification-table"
import NavigationPagination         from "@/components/shared/navigation-pagination"
import { Metadata }                 from "next"
import { notFound }                 from "next/navigation"

interface NotificationsPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications here.",
}

export default async function NotificationsPage({ params, searchParams }: Readonly<NotificationsPageProps>) {
    const [ username, pageParams ] = await Promise.all([ params, searchParams ])
    if (!pageParams) return null
    if (!username) return notFound()
    
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as string) || "DESC"
    const orderBy = (pageParams.orderBy as string) || "createdAt"
    
    const notificationsState = await getAllNotificationsPaginated({ page, perPage, direction, orderBy })
    
    const pagination = notificationsState.response?.data as Paginated<Notification>
    const content = pagination.content ?? []
    
    return (
        <div className="container" aria-labelledby="page-title" aria-describedby="page-description">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1
                    id="page-title"
                    className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Notifications
                </h1>
                <p id="page-description" className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.totalElements } notification(s) available. Manage them here.
                </p>
            </header>

            <main className="mt-8 -mb-4 flow-root border-t border-stone-200 pt-8">
                <DashboardNotificationTable notifications={ content } />
            </main>

            <NavigationPagination pageInfo={ pagination } />
        </div>
    )
}
