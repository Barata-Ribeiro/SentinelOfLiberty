"use client"

import postAuthLogin                     from "@/actions/auth/post-auth-login"
import ApplicationRequestFormError       from "@/components/feedback/application-request-form-error"
import InputValidationError              from "@/components/feedback/input-validation-error"
import FormButton                        from "@/components/shared/form-button"
import FormInput                         from "@/components/shared/form-input"
import { getInitialFormState }           from "@/utils/functions"
import { Field, Fieldset, Input, Label } from "@headlessui/react"
import { useSession }                    from "next-auth/react"
import Link                              from "next/link"
import { useRouter }                     from "next/navigation"
import { useActionState, useEffect }     from "react"
import { FaArrowRightToBracket }         from "react-icons/fa6"
import { LuCircleUserRound, LuLock }     from "react-icons/lu"

export default function LoginForm() {
    const { update } = useSession()
    const [ formState, formAction, pending ] = useActionState(postAuthLogin, getInitialFormState())
    const router = useRouter()
    
    useEffect(() => {
        if (formState.ok) {
            update().then((session) => {
                router.replace(`/dashboard/${ session?.user.username }`)
                router.refresh()
            })
            
        }
    }, [ formState.ok, formState.response?.data, router ]) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <form action={ formAction } className="space-y-6">
            <FormInput
                label="Username"
                type="text"
                name="username"
                autoComplete="username"
                aria-autocomplete="list"
                icon={ LuCircleUserRound }
                iconPlacement="start"
                required
                aria-required
            />

            <FormInput
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                aria-autocomplete="list"
                icon={ LuLock }
                iconPlacement="start"
                required
                aria-required
            />

            <Fieldset className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Field className="flex items-center">
                    <Input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="form-checkbox text-marigold-600 focus:ring-marigold-600 size-4 rounded-sm border-stone-300"
                    />
                    <Label htmlFor="rememberMe" className="text-shadow-900 ml-3 block text-sm leading-6">
                        Remember me
                    </Label>
                </Field>

                <div className="text-sm leading-6">
                    <Link
                        href="/auth/reset-password"
                        className="text-marigold-600 hover:text-marigold-500 active:text-marigold-700 font-semibold">
                        Forgot password?
                    </Link>
                </div>
            </Fieldset>
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ JSON.parse((formState.error as string).split(". R")[0]) } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton width="full" pending={ pending }>
                Login <FaArrowRightToBracket aria-hidden="true" className="size-4 stroke-2" />
            </FormButton>
        </form>
    )
}
