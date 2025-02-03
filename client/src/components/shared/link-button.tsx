"use client"

import tw                                  from "@/utils/tw"
import Link                                from "next/link"
import { AnchorHTMLAttributes, ReactNode } from "react"
import { twMerge }                         from "tailwind-merge"

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode
}

export default function LinkButton({ children, href, className, ...props }: LinkButtonProps) {
    const baseStyles = tw`focus-visible:outline-marigold-600 inline-flex items-center justify-center gap-x-2 rounded-md text-center text-sm font-semibold transition duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2`
    
    const mergedStyles = twMerge(baseStyles, className)
    
    return (
        <Link href={ href ?? "#" } { ...props } className={ mergedStyles }>
            { children }
        </Link>
    )
}
