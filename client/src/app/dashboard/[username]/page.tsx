import { notFound } from "next/navigation"

interface DashboardHomePageProps {
    params: Promise<{ username: string }>
}

export default async function DashboardHomePage({ params }: DashboardHomePageProps) {
    const username = (await params).username
    if (!username) return notFound()

    return <section>{username}</section>
}
