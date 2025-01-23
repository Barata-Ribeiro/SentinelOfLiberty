import { auth }               from "auth"
import { notFound, redirect } from "next/navigation"
import { ReactNode }          from "react"

interface DashboardLayoutProps {
    children?: ReactNode
    params: Promise<{ username: string }>
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const username = (await params).username
    if (!username) return notFound()
    
    const session = await auth()
    if (!session) return redirect("/auth/login")
    
    return (
        <main>
            <div>{ JSON.stringify(session) }</div>
            { children }
        </main>
    )
}
