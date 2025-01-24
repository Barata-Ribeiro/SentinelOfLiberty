import DashboardSideBar from "@/components/dashboard-sidebar"
import { notFound }     from "next/navigation"
import { ReactNode }    from "react"

interface DashboardLayoutProps {
    children?: ReactNode
    params: Promise<{ username: string }>
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const username = (await params).username
    if (!username) return notFound()
    
    return (
        <main className="flex items-start gap-4 w-full h-full container">
            <DashboardSideBar />
            { children }
        </main>
    )
}
