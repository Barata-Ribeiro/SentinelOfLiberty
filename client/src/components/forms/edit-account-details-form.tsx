"use client"

import { ProblemDetails }          from "@/@types/application"
import patchAccountDetails         from "@/actions/users/patch-account-details"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError        from "@/components/feedback/input-validation-error"
import FormButton                  from "@/components/shared/form-button"
import FormInput                   from "@/components/shared/form-input"
import FormSwitch                  from "@/components/shared/form-switch"
import { getInitialFormState }     from "@/utils/functions"
import { Fieldset, Legend }        from "@headlessui/react"
import { useSession }              from "next-auth/react"
import { useActionState }          from "react"
import { LuLink }                  from "react-icons/lu"

export default function EditAccountDetailsForm() {
    const { data: session } = useSession()
    
    const [ formState, formAction, pending ] = useActionState(patchAccountDetails, getInitialFormState())
    
    const isPrivateText = session?.user.isPrivate ? "private" : "public"
    
    return (
        <form action={ formAction } className="mt-6 space-y-6">
            <FormInput
                type="password"
                label="Current Password"
                name="currentPassword"
                autoComplete="current-password webauthn"
                aria-autocomplete="list"
                required
                aria-required
            />

            <Fieldset className="space-y-2">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Full name</Legend>
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <FormInput type="text" label="First Name" name="firstName" />

                    <FormInput type="text" label="Last Name" name="lastName" />
                </div>
            </Fieldset>
            
            <FormInput type="url"
                       name="website"
                       label="Your website"
                       pattern="https://.*"
                       placeholder="https://example.com"
                       icon={ LuLink }
                       iconPlacement="start" />

            <FormInput
                type="date"
                label="Birth Date"
                name="birthDate"
                max={ new Date().toISOString().split("T")[0] }
                autoComplete="bday"
                aria-autocomplete="list"
            />

            <FormSwitch
                checked={ session?.user.isPrivate }
                label="Private Profile"
                description={ `Change the visibility of your profile. Currently set to ${ isPrivateText }.` }
                name="isPrivate"
            />
            
            { formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
            ) }
            
            { formState.error && Array.isArray(formState.error) && <InputValidationError errors={ formState.error } /> }
            
            <FormButton width="full" pending={ pending }>
                Save Changes
            </FormButton>
        </form>
    )
}
