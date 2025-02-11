import { Field, Label, Textarea } from "@headlessui/react"
import { TextareaHTMLAttributes } from "react"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
}

export default function FormTextarea({ label, ...props }: FormTextareaProps) {
    return (
        <Field className="relative w-full min-w-[200px]" disabled={ props.disabled }>
            <Textarea
                { ...props }
                className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-stone-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-shadow-700 outline-0 transition-all placeholder-shown:border placeholder-shown:border-stone-200 placeholder-shown:border-t-stone-200 focus:border-2 focus:border-stone-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-stone-50"
                placeholder=" "></Textarea>
            <Label className="before:content[' '] after:content[' '] text-shadow-400 peer-placeholder-shown:text-shadow-500 peer-disabled:peer-placeholder-shown:text-shadow-500 peer-focus:text-shadow-900 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full text-xs leading-tight font-normal transition-all select-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-[11px] peer-focus:leading-tight peer-disabled:text-transparent before:pointer-events-none before:mt-[6.2px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-stone-200 before:transition-all peer-placeholder-shown:before:border-transparent peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-stone-900 peer-disabled:before:border-transparent after:pointer-events-none after:mt-[6.2px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-stone-200 after:transition-all peer-placeholder-shown:after:border-transparent peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-stone-900 peer-disabled:after:border-transparent">
                { label }
            </Label>
        </Field>
    )
}
