import tw                                  from "@/utils/tw"
import { Button }                          from "@headlessui/react"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge }                         from "tailwind-merge"

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    className?: string
}

export default function FormButton({ children, className, ...props }: FormButtonProps) {
    const defaultStyles = tw`inline-flex items-center justify-center gap-x-2 rounded-md bg-marigold-600 px-3.5 py-2.5 text-center text-sm font-semibold text-marigold-50 shadow-xs transition duration-200 hover:bg-marigold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600 active:bg-marigold-700 disabled:pointer-events-none disabled:opacity-50`
    const styles = twMerge(defaultStyles, className)
    return (
        <Button className={ styles } type="submit" { ...props }>
            { children }
        </Button>
    )
}
