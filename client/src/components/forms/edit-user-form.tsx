"use client"

import { ProblemDetails } from "@/@types/application"
import { Profile } from "@/@types/user"
import patchUpdateUser from "@/actions/admin/patch-update-user"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import FormButton from "@/components/shared/form-button"
import FormInput from "@/components/shared/form-input"
import FormTextarea from "@/components/shared/form-textarea"
import { getInitialFormState } from "@/utils/functions"
import { Fieldset, Legend } from "@headlessui/react"
import { useActionState } from "react"
import { LuLink } from "react-icons/lu"

interface EditUserFormProps {
    user: Profile
}

export default function EditUserForm({ user }: Readonly<EditUserFormProps>) {
    const [formState, formAction, pending] = useActionState(patchUpdateUser, getInitialFormState())

    return (
        <form action={formAction} className="mx-auto mb-8 grid max-w-1/2 grid-cols-1 content-stretch gap-6">
            <input type="hidden" name="currentUsername" defaultValue={user.username} />

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
                <FormInput type="text" label="Username" name="username" defaultValue={user.username} />
                <FormInput type="email" label="Email" name="email" defaultValue={user.email} />
                <FormInput type="text" label="Display Name" name="displayName" defaultValue={user.displayName} />
                <FormTextarea
                    label="Biography"
                    name="biography"
                    defaultValue={user.biography ?? ""}
                    rows={2}
                    maxLength={160}
                    placeholder="Describe yourself here..."
                    description="Use a maximum of 160 characters to describe yourself."
                />
            </Fieldset>

            <Fieldset className="space-y-2">
                <Legend className="font-heading text-shadow-800 text-lg font-bold">Full name</Legend>
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <FormInput type="text" label="First Name" name="firstName" />

                    <FormInput type="text" label="Last Name" name="lastName" />
                </div>
                {user.fullName && <small className="text-sm">Current: {user.fullName}</small>}
            </Fieldset>

            <FormInput
                type="url"
                label="Your website"
                pattern="https://.*"
                defaultValue={user.website ?? ""}
                placeholder="https://example.com"
                icon={LuLink}
                iconPlacement="start"
            />

            <FormInput
                type="date"
                label="Birth Date"
                name="birthDate"
                defaultValue={user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : ""}
                max={new Date().toISOString().split("T")[0]}
                autoComplete="bday"
                aria-autocomplete="list"
            />

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
