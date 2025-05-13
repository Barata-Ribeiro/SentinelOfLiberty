"use client"

import { Button, Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes } from "react"
import { FaAngleDown } from "react-icons/fa6"

interface FormDropdownInputProps extends InputHTMLAttributes<HTMLInputElement> {
    options: string[]
    label: string
    disabledField?: boolean
}

export default function FormDropdownInput({
    label,
    options,
    disabledField,
    ...props
}: Readonly<FormDropdownInputProps>) {
    return (
        <Field className="mt-4 w-full max-w-sm min-w-[200px]" disabled={disabledField}>
            <Label className="text-shadow-600 mb-1 block text-sm capitalize">{label}</Label>
            <div className="relative mt-2">
                <div className="absolute top-2 left-0 flex items-center pl-3">
                    <Button
                        type="button"
                        id="dropdownButton"
                        className="text-shadow-700 flex h-full items-center justify-center bg-transparent text-sm focus:outline-none">
                        Choose
                        <FaAngleDown aria-hidden="true" className="ml-1 size-4 text-inherit" />
                    </Button>
                    <div className="ml-2 h-6 border-l border-stone-200"></div>
                    <div
                        id="dropdownMenu"
                        className="absolute left-0 z-10 mt-10 hidden w-full min-w-[150px] overflow-hidden rounded-md border border-stone-200 bg-white shadow-lg">
                        <ul id="dropdownOptions">
                            {options.map(option => (
                                <li
                                    key={option}
                                    className="text-shadow-600 cursor-pointer px-4 py-2 text-sm capitalize hover:bg-stone-50">
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Input
                    {...props}
                    className="ease text-shadow-700 placeholder:text-shadow-400 w-full rounded-md border border-stone-200 bg-transparent py-2 pr-3 pl-32 text-sm shadow-sm transition duration-300 hover:border-stone-300 focus:border-stone-400 focus:shadow-sm focus:ring-1 focus:ring-stone-400/50 focus:outline-hidden data-disabled:pointer-events-none data-disabled:bg-stone-100"
                    placeholder={`Enter the ${label.toLowerCase()} value`}
                />
            </div>
        </Field>
    )
}
