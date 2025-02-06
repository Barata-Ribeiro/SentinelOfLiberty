"use client"

import { Field, Input }        from "@headlessui/react"
import { InputHTMLAttributes } from "react"
import { IconType }            from "react-icons"

interface FormInputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
    disabledField?: boolean
    reactIconAction: IconType
}

export default function FormInputWithIcon({
                                              reactIconAction: Icon,
                                              disabledField,
                                              placeholder,
                                              ...props
                                          }: FormInputWithIconProps) {
    return (
        <Field className="w-full min-w-[200px]" disabled={ disabledField }>
            <div className="relative">
                <Input
                    { ...props }
                    className="ease text-shadow-600 placeholder:text-shadow-400 placeholder:font-heading w-full rounded-md border border-stone-200 bg-transparent py-2 pr-10 pl-3 text-sm shadow-xs transition duration-300 placeholder:text-sm hover:border-stone-300 focus:border-stone-400 focus:ring-1 focus:shadow-sm focus:ring-stone-400/50 focus:outline-hidden data-disabled:pointer-events-none data-disabled:bg-stone-100"
                    placeholder={ placeholder }
                />

                <Icon aria-hidden="true" className="text-shadow-600 absolute top-2.5 right-2.5 size-5" />
            </div>
        </Field>
    )
}
