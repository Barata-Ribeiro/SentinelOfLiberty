"use client"

import { ProblemDetails }          from "@/@types/application"
import postAuthRegister            from "@/actions/auth/post-auth-register"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError        from "@/components/feedback/input-validation-error"
import Spinner                     from "@/components/helpers/spinner"
import FormButton                  from "@/components/shared/form-button"
import FormInput                   from "@/components/shared/form-input"
import { getInitialFormState }     from "@/utils/functions"
import { Fieldset, Legend }        from "@headlessui/react"
import { useActionState }          from "react"

export default function RegisterForm() {
    const [ formState, formAction, pending ] = useActionState(postAuthRegister, getInitialFormState())
    
    return (
        <form action={ formAction } className="space-y-6">
            <FormInput label="Username" type="text" name="username" required />
            <FormInput label="Email" type="email" name="email" required />
            <FormInput label="Display Name" type="text" name="displayName" required />

            <Fieldset className="w-full space-y-4">
                <Legend className="font-heading text-lg font-bold text-shadow-800">Security</Legend>
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    description="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                    autoComplete="new-password"
                    aria-autocomplete="list"
                    required
                />
                <FormInput label="Confirm Password" type="password" name="confirmPassword" required />
            </Fieldset>
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton className="w-full" disabled={ pending }>
                { pending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                      "Create Account"
                  ) }
            </FormButton>
        </form>
    )
}
