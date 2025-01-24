import tw                                             from "@/utils/tw"
import { Description, Field, Input, Label }           from "@headlessui/react"
import { ChangeEvent, InputHTMLAttributes, useState } from "react"
import { twMerge }                                    from "tailwind-merge"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    disabledField?: boolean
    label: string
    description?: string
}

export default function FormInput({
                                      label,
                                      description,
                                      disabledField,
                                      onChange,
                                      defaultValue = "",
                                      value,
                                      ...props
                                  }: Readonly<FormInputProps>) {
    const [ hasValue, setHasValue ] = useState(!!value || !!defaultValue)
    
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setHasValue(!!e.target.value)
        onChange?.(e)
    }
    
    const labelStyle = tw`absolute left-2.5 origin-left transform cursor-text bg-white px-1 text-sm text-shadow-400 transition-all peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-xs peer-focus:text-shadow-400 data-disabled:pointer-events-none data-disabled:select-none data-disabled:opacity-50`
    
    return (
        <div className="w-full min-w-[200px]">
            <Field className="relative" disabled={ disabledField }>
                <Input
                    className="data-disabled:bg-gray-100 peer w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm text-shadow-700 shadow-xs transition duration-300 placeholder:text-shadow-400 hover:border-stone-300 focus:border-stone-400 focus:shadow-sm focus:outline-hidden focus:ring-1 focus:ring-stone-400/50 data-disabled:pointer-events-none"
                    value={ value }
                    defaultValue={ defaultValue }
                    onChange={ handleChange }
                    { ...props }
                />
                <Label
                    className={ twMerge(
                        labelStyle,
                        hasValue ? "-top-2 scale-90 text-xs text-shadow-400" : "top-2.5 scale-100 text-sm",
                    ) }>
                    { label }
                </Label>
                { description && (
                    <Description className="mt-1 px-1.5 text-xs text-shadow-300 data-disabled:pointer-events-none data-disabled:opacity-50">
                        { description }
                    </Description>
                ) }
            </Field>
        </div>
    )
}
