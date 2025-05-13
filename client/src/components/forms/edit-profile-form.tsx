"use client"

import { ProblemDetails } from "@/@types/application"
import patchOwnProfile from "@/actions/users/patch-own-profile"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import FormButton from "@/components/shared/form-button"
import FormInput from "@/components/shared/form-input"
import FormTextarea from "@/components/shared/form-textarea"
import { getInitialFormState } from "@/utils/functions"
import { Fieldset, Legend } from "@headlessui/react"
import { useActionState } from "react"
import { LuLink } from "react-icons/lu"

export default function EditProfileForm() {
    const [formState, formAction, pending] = useActionState(patchOwnProfile, getInitialFormState())

    return (
        <form action={formAction} className="mt-6 space-y-6">
            <FormInput
                type="password"
                label="Current Password"
                name="currentPassword"
                autoComplete="current-password"
                aria-autocomplete="list"
                required
                aria-required
            />

            <Fieldset className="w-full space-y-4">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Account Information</Legend>
                <FormInput type="text" label="Username" name="username" />
                <FormInput type="email" label="Email" name="email" />
                <FormInput type="text" label="Display Name" name="displayName" />
            </Fieldset>

            <Fieldset>
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Avatar & Biography</Legend>
                <FormInput
                    type="url"
                    name="avatarUrl"
                    label="Avatar URL"
                    pattern="https://.*"
                    placeholder="https://example.com/avatar.png"
                    icon={LuLink}
                    iconPlacement="start"
                />

                <FormTextarea
                    label="Biography"
                    name="biography"
                    rows={2}
                    maxLength={160}
                    placeholder="Describe yourself here..."
                    description="Use a maximum of 160 characters to describe yourself."
                />
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

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <FormButton width="full" pending={pending}>
                Save Changes
            </FormButton>
        </form>
    )
}
