import tw from "@/utils/tw"
import { Description, Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes } from "react"
import { IconType } from "react-icons"
import { LuInfo } from "react-icons/lu"
import { twMerge } from "tailwind-merge"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    description?: string
    icon?: IconType
    iconPlacement?: "start" | "end"
}

export default function FormInput({
    label,
    description,
    icon: Icon,
    iconPlacement,
    className,
    ...props
}: Readonly<FormInputProps>) {
    if ((Icon && !iconPlacement) || (iconPlacement && !Icon)) {
        throw new Error("Icon and iconPlacement must be used together.")
    }

    const inputDefaultStyles = tw`peer text-shadow-800 placeholder:text-shadow-300 dark:text-shadow-50 w-full rounded-md border border-stone-200 bg-transparent px-2.5 py-2 text-sm shadow-sm ring ring-transparent transition-all duration-300 ease-in outline-none hover:border-stone-800 hover:ring-stone-300 focus:border-stone-800 focus:ring-stone-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed data-[icon-placement=end]:pe-9 data-[icon-placement=start]:ps-9`

    return (
        <Field className="w-full min-w-[200px] space-y-2" disabled={props.disabled}>
            <Label className="text-shadow-800 dark:text-shadow-50 text-sm font-semibold antialiased">{label}</Label>

            <div className="relative w-full">
                <Input
                    className={twMerge(inputDefaultStyles, className)}
                    data-icon-placement={iconPlacement}
                    {...props}
                />
                {Icon && (
                    <span
                        className="text-shadow-400 peer-focus:text-shadow-800 dark:peer-hover:text-shadow-50 dark:peer-focus:text-shadow-50 pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 overflow-hidden transition-all duration-300 ease-in data-[placement=end]:right-2.5 data-[placement=start]:left-2.5"
                        data-placement={iconPlacement}>
                        <Icon aria-hidden="true" className="h-full w-full" />
                    </span>
                )}
            </div>

            {description && (
                <div className="text-shadow-600 flex gap-1.5">
                    <LuInfo aria-hidden="true" className="size-3.5 shrink-0 translate-y-[3px] stroke-2" />
                    <Description as="small" className="text-sm text-current antialiased">
                        {description}
                    </Description>
                </div>
            )}
        </Field>
    )
}
