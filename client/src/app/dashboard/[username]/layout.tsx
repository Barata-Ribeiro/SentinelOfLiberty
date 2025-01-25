import { notFound }  from "next/navigation"
import { ReactNode } from "react"

interface DashboardLayoutProps {
    children?: ReactNode
    params: Promise<{ username: string }>
}

export default async function DashboardLayout({ children, params }: Readonly<DashboardLayoutProps>) {
    const username = (await params).username
    if (!username) return notFound()
    
    return <div className="container">{ children }</div>
}
