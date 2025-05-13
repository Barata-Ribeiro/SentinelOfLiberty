import Spinner from "@/components/helpers/spinner"
import tw from "@/utils/tw"
import { Button } from "@headlessui/react"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    className?: string
    width?: "full" | "auto"
    pending?: boolean
}

export default function FormButton({ children, className, width, pending, ...props }: Readonly<FormButtonProps>) {
    const defaultStyles = tw`data-[width=auto:w-auto from-marigold-500 to-marigold-600 border-marigold-500 text-shadow-50 inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-md border bg-gradient-to-tr px-4 py-2 text-center text-sm font-medium shadow-sm transition-all duration-300 ease-in hover:shadow-md hover:brightness-105 focus:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none data-[width=full]:w-full`
    const styles = twMerge(defaultStyles, className)
    return (
        <Button type="submit" data-width={width} className={styles} disabled={props.disabled ?? pending} {...props}>
            {pending ? (
                <>
                    <Spinner /> Loading...
                </>
            ) : (
                children
            )}
        </Button>
    )
}
