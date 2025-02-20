"use client"

import { ProblemDetails }          from "@/@types/application"
import postAuthRegister            from "@/actions/auth/post-auth-register"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError        from "@/components/feedback/input-validation-error"
import FormButton                  from "@/components/shared/form-button"
import FormInput                   from "@/components/shared/form-input"
import { getInitialFormState }     from "@/utils/functions"
import { Fieldset, Legend }        from "@headlessui/react"
import { useActionState }          from "react"

export default function RegisterForm() {
    const [ formState, formAction, pending ] = useActionState(postAuthRegister, getInitialFormState())
    
    return (
        <form action={ formAction } className="space-y-6">
            <FormInput
                type="text"
                label="Username"
                name="username"
                placeholder="johndoe/janedoe"
                required
                aria-required
            />

            <FormInput
                type="email"
                label="Email"
                name="email"
                placeholder="contact@example.com"
                required
                aria-required
            />

            <FormInput
                type="text"
                label="Display Name"
                name="displayName"
                placeholder="John/Jane Doe"
                required
                aria-required
            />

            <Fieldset className="w-full space-y-4">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Security</Legend>
                <FormInput
                    type="password"
                    label="Password"
                    name="password"
                    placeholder="********"
                    description="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                    autoComplete="new-password"
                    aria-autocomplete="list"
                    required
                    aria-required
                />
                <FormInput label="Confirm Password" type="password" name="confirmPassword" required aria-required />
            </Fieldset>
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton width="full" pending={ pending }>
                Create Account
            </FormButton>
        </form>
    )
}
