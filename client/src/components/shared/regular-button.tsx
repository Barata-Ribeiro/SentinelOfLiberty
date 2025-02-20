import Spinner                             from "@/components/helpers/spinner"
import tw                                  from "@/utils/tw"
import { Button }                          from "@headlessui/react"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge }                         from "tailwind-merge"

interface RegularButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    buttonStyle: "ghost" | "inverted-ghost" | "colored" | "danger"
    pending?: boolean
}

export default function RegularButton({
                                          children,
                                          className,
                                          buttonStyle,
                                          pending,
                                          ...props
                                      }: Readonly<RegularButtonProps>) {
    const baseStyles = tw`inline-flex cursor-pointer items-center gap-x-2 rounded-md border px-4 py-2 text-center text-sm font-medium transition-all duration-300 ease-in disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`
    
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
        tw`border border-transparent bg-transparent text-stone-50 shadow-none hover:border-stone-300 hover:bg-stone-300 hover:text-stone-900 hover:shadow-none`,
    )
    
    const alertStyle = twMerge(
        baseStyles,
        className,
        tw`text-shadow-50 border-red-500 bg-gradient-to-tr from-red-500 to-red-700 shadow-sm hover:shadow-md hover:brightness-110`,
    )
    
    let buttonFinalStyle
    switch (buttonStyle) {
        case "ghost":
            buttonFinalStyle = ghostStyle
            break
        case "inverted-ghost":
            buttonFinalStyle = invertedGhostStyle
            break
        case "danger":
            buttonFinalStyle = alertStyle
            break
        default:
            buttonFinalStyle = coloredStyle
    }
    
    return (
        <Button type="button" className={ buttonFinalStyle } disabled={ props.disabled ?? pending } { ...props }>
            { pending ? (
                <>
                    <Spinner /> Loading...
                </>
            ) : (
                  children
              ) }
        </Button>
    )
}
