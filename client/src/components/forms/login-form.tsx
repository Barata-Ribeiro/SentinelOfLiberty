"use client"

import { State }                         from "@/@types/application"
import postAuthLogin                     from "@/actions/auth/post-auth-login"
import ApplicationRequestFormError       from "@/components/feedback/application-request-form-error"
import InputValidationError              from "@/components/feedback/input-validation-error"
import Spinner                           from "@/components/helpers/spinner"
import FormButton                        from "@/components/shared/form-button"
import FormInput                         from "@/components/shared/form-input"
import { Field, Fieldset, Input, Label } from "@headlessui/react"
import Link                              from "next/link"
import { useActionState }                from "react"
import { FaArrowRightToBracket }         from "react-icons/fa6"

const initialState: State = {
    ok: false,
    error: null,
    response: null,
}

export default function LoginForm() {
    const [ formState, formAction, pending ] = useActionState(postAuthLogin, initialState)
    
    return (
        <form action={ formAction } className="space-y-6">
            <FormInput label="Username" type="text" name="username" autoComplete="username" required />
            <FormInput label="Password" type="password" name="password" autoComplete="current-password" required />

            <Fieldset className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Field className="flex items-center">
                    <Input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="size-4 rounded border-stone-300 text-marigold-600 focus:ring-marigold-600"
                    />
                    <Label htmlFor="rememberMe" className="ml-3 block text-sm leading-6 text-shadow-900">
                        Remember me
                    </Label>
                </Field>

                <div className="text-sm leading-6">
                    <Link
                        href="/auth/reset-password"
                        className="font-semibold text-marigold-600 hover:text-marigold-500 active:text-marigold-700">
                        Forgot password?
                    </Link>
                </div>
            </Fieldset>
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ JSON.parse(String(formState.error).split(". R")[0]) } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton className="w-full" disabled={ pending }>
                { pending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                      <>
                        Login <FaArrowRightToBracket aria-hidden="true" className="size-4" />
                    </>
                  ) }
            </FormButton>
        </form>
    )
}
