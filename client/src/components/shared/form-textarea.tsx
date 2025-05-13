import { Description, Field, Label, Textarea } from "@headlessui/react"
import { TextareaHTMLAttributes } from "react"
import { LuInfo } from "react-icons/lu"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    description?: string
}

export default function FormTextarea({ label, description, ...props }: Readonly<FormTextareaProps>) {
    return (
        <Field className="relative w-full min-w-[200px] space-y-2" disabled={props.disabled}>
            <Label className="text-shadow-800 dark:text-shadow-50 font-sans text-sm font-semibold antialiased">
                {label}
            </Label>

            <Textarea
                {...props}
                className="peer text-shadow-800 placeholder:text-shadow-300 dark:text-shadow-50 block w-full resize-none rounded-md border border-stone-200 bg-transparent p-2.5 text-sm leading-none shadow-sm ring ring-transparent transition-all duration-300 ease-in outline-none hover:border-stone-800 hover:ring-stone-300 focus:border-stone-800 focus:ring-stone-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50"></Textarea>

            {description && (
                <p className="text-shadow-600 flex gap-1.5">
                    <LuInfo aria-hidden="true" className="size-3.5 shrink-0 translate-y-[3px] stroke-2" />
                    <Description as="small" className="text-sm text-current antialiased">
                        {description}
                    </Description>
                </p>
            )}
        </Field>
    )
}
