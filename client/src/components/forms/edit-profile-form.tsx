"use client"

import { ProblemDetails }          from "@/@types/application"
import patchOwnProfile             from "@/actions/users/patch-own-profile"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError        from "@/components/feedback/input-validation-error"
import Spinner                     from "@/components/helpers/spinner"
import FormButton                  from "@/components/shared/form-button"
import FormInput                   from "@/components/shared/form-input"
import FormTextarea                from "@/components/shared/form-textarea"
import { getInitialFormState }     from "@/utils/functions"
import { Fieldset, Legend }        from "@headlessui/react"
import { useActionState }          from "react"

export default function EditProfileForm() {
    const [ formState, formAction, pending ] = useActionState(patchOwnProfile, getInitialFormState())
    
    return (
        <form action={ formAction } className="mt-6 space-y-6">
            <FormInput
                label="Current Password"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                aria-autocomplete="list"
                required
            />

            <Fieldset className="w-full space-y-4">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Account Information</Legend>
                <FormInput label="Username" type="text" name="username" />
                <FormInput label="Email" type="email" name="email" />
                <FormInput label="Display Name" type="text" name="displayName" />
                <FormTextarea label="Biography" name="biography" maxLength={ 160 } />
            </Fieldset>

            <Fieldset className="w-full space-y-4">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Security</Legend>
                <FormInput
                    label="New Password"
                    type="password"
                    name="newPassword"
                    description="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                    autoComplete="new-password"
                    aria-autocomplete="list"
                />
                <FormInput label="Confirm New Password" type="password" name="confirmNewPassword" />
            </Fieldset>
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton className="w-full justify-center" disabled={ pending }>
                { pending ? (
                    <>
                        <Spinner /> Loading...
                    </>
                ) : (
                      "Save Changes"
                  ) }
            </FormButton>
        </form>
    )
}
