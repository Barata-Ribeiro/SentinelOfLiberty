"use client"

import { Description, Field, Label, Switch } from "@headlessui/react"
import { useState }                          from "react"

interface FormSwitchProps {
    checked?: boolean
    label: string
    description: string
    name: string
    disabledField?: boolean
}

export default function FormSwitch({ checked, label, description, name, disabledField }: FormSwitchProps) {
    const [ enabled, setEnabled ] = useState(checked)
    
    return (
        <Field className="grid gap-y-2" disabled={ disabledField }>
            <Label className="text-shadow-400">{ label }</Label>
            <Switch
                checked={ enabled }
                onChange={ setEnabled }
                name={ name }
                className="group focus:ring-marigold-600 relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:grayscale-100">
                <span className="sr-only">Toggle switch</span>
                <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white" />
                <span
                    aria-hidden="true"
                    className="group-data-[checked]:bg-marigold-600 pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-stone-200 transition-colors duration-200 ease-in-out"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-stone-200 bg-white ring-0 shadow transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-5"
                />
            </Switch>
            <Description className="text-shadow-300 text-sm">{ description }</Description>
        </Field>
    )
}
