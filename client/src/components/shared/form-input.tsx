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
                                      defaultValue,
                                      value,
                                      ...props
                                  }: Readonly<FormInputProps>) {
    const [ hasValue, setHasValue ] = useState(!!value || !!defaultValue)
    
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setHasValue(!!e.target.value)
        onChange?.(e)
    }
    
    const labelStyle = tw`text-shadow-400 peer-focus:text-shadow-400 absolute left-2.5 origin-left transform cursor-text bg-white px-1 text-sm transition-all peer-focus:-top-2 peer-focus:scale-90 peer-focus:text-xs data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:select-none`
    
    return (
        <div className="w-full min-w-[200px]">
            <Field className="relative" disabled={ disabledField }>
                <Input
                    className="peer text-shadow-700 placeholder:text-shadow-400 w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-xs transition duration-300 hover:border-stone-300 focus:border-stone-400 focus:ring-1 focus:shadow-sm focus:ring-stone-400/50 focus:outline-hidden data-disabled:pointer-events-none data-disabled:bg-gray-100"
                    value={ value }
                    defaultValue={ defaultValue }
                    onChange={ handleChange }
                    { ...props }
                />
                <Label
                    className={ twMerge(
                        labelStyle,
                        hasValue ? "text-shadow-400 -top-2 scale-90 text-xs" : "top-2.5 scale-100 text-sm",
                    ) }>
                    { label }
                </Label>
                { description && (
                    <Description className="text-shadow-300 mt-1 px-1.5 text-xs data-disabled:pointer-events-none data-disabled:opacity-50">
                        { description }
                    </Description>
                ) }
            </Field>
        </div>
    )
}
