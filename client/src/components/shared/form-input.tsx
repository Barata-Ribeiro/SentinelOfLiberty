import { Description, Field, Input, Label } from "@headlessui/react"
import { InputHTMLAttributes }              from "react"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    disabledField?: boolean
    label: string
    description?: string
}

export default function FormInput({ label, description, disabledField, ...props }: FormInputProps) {
    return (
        <div className="w-full min-w-[200px]">
            <Field className="relative" disabled={ disabledField }>
                <Input
                    className="bg-transparent ease data-[disabled]:bg-gray-100 peer w-full rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-700 shadow-sm transition duration-300 placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-400 focus:shadow focus:outline-none focus:ring-1 focus:ring-stone-400/50 data-[disabled]:pointer-events-none"
                    { ...props }
                />
                <Label className="absolute left-2.5 top-2.5 origin-left transform cursor-text bg-white px-1 text-sm text-stone-400 transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:text-xs peer-focus:text-stone-400 data-[disabled]:pointer-events-none data-[disabled]:select-none data-[disabled]:opacity-50">
                    { label }
                </Label>
                { description && (
                    <Description className="data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        { description }
                    </Description>
                ) }
            </Field>
        </div>
    )
}
