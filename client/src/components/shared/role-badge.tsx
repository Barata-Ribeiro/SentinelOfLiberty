import { Roles }   from "@/@types/user"
import tw          from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface RoleBadgeProps {
    role: Roles
}

export default function RoleBadge({ role }: Readonly<RoleBadgeProps>) {
    const defaultStyles = tw`mt-2 rounded-full border px-2.5 py-1 text-xs leading-none font-medium capitalize select-none`
    const adminStyles = twMerge(
        defaultStyles,
        tw`border-red-400 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`,
    )
    const readerStyles = twMerge(defaultStyles, tw`border-stone-500 bg-stone-100 text-stone-800`)
    
    const isAdmin = role === "ADMIN"
    
    return (
        <span
            className={ isAdmin ? adminStyles : readerStyles }
            aria-label={ isAdmin ? "Admin Role" : "Reader Role" }
            title={ isAdmin ? "Admin Role" : "Reader Role" }>
            { isAdmin ? "Admin" : "Reader" }
        </span>
    )
}
