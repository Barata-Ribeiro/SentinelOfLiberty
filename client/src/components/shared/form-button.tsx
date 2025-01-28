import tw                                  from "@/utils/tw"
import { Button }                          from "@headlessui/react"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge }                         from "tailwind-merge"

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    className?: string
}

export default function FormButton({ children, className, ...props }: Readonly<FormButtonProps>) {
    const defaultStyles = tw`bg-marigold-600 text-marigold-50 hover:bg-marigold-500 focus-visible:outline-marigold-600 active:bg-marigold-700 inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-xs transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50`
    const styles = twMerge(defaultStyles, className)
    return (
        <Button className={ styles } type="submit" { ...props }>
            { children }
        </Button>
    )
}
