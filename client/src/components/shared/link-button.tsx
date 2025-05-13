"use client"

import tw from "@/utils/tw"
import Link from "next/link"
import { AnchorHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode
    buttonStyle: "ghost" | "inverted-ghost" | "colored"
}

export default function LinkButton({ children, href, buttonStyle, ...props }: Readonly<LinkButtonProps>) {
    const baseStyles = tw`rounded-md border px-4 py-2 text-center text-sm font-medium transition-all duration-300 ease-in`

    const coloredStyle = twMerge(
        baseStyles,
        tw`from-marigold-500 to-marigold-600 border-marigold-500 text-shadow-50 bg-gradient-to-tr shadow-sm hover:shadow-md hover:brightness-110`,
    )

    const ghostStyle = twMerge(
        baseStyles,
        tw`border border-transparent bg-transparent text-stone-900 shadow-none hover:border-stone-200 hover:bg-stone-100 hover:shadow-none`,
    )

    const invertedGhostStyle = twMerge(
        baseStyles,
        tw`border border-transparent bg-transparent text-stone-50 shadow-none hover:border-stone-50 hover:bg-stone-100 hover:text-stone-900 hover:shadow-none`,
    )

    let buttonFinalStyle
    if (buttonStyle === "colored") buttonFinalStyle = coloredStyle
    else if (buttonStyle === "ghost") buttonFinalStyle = ghostStyle
    else buttonFinalStyle = invertedGhostStyle

    return (
        <Link href={href ?? "#"} className={buttonFinalStyle} {...props}>
            {children}
        </Link>
    )
}
