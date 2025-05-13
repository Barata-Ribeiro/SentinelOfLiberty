"use client"

import { ProblemDetails } from "@/@types/application"
import postNewNotice from "@/actions/notices/post-new-notice"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import FormButton from "@/components/shared/form-button"
import FormInput from "@/components/shared/form-input"
import { getInitialFormState } from "@/utils/functions"
import { useRouter } from "next/navigation"
import { type Dispatch, type SetStateAction, useActionState, useEffect } from "react"

export default function NewNoticeForm({ setOpen }: Readonly<{ setOpen?: Dispatch<SetStateAction<boolean>> }>) {
    const [formState, formAction, pending] = useActionState(postNewNotice, getInitialFormState())
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) {
            if (setOpen) setOpen(false)
            router.refresh()
        }
    }, [formState.ok, router, setOpen])

    return (
        <form action={formAction} className="mt-6 space-y-6">
            <FormInput
                label="Title"
                name="title"
                minLength={10}
                maxLength={100}
                placeholder="Enter a title for the notice"
                description="Use at least 10 characters and a maximum of 100 characters."
            />
            <FormInput
                label="Message"
                name="message"
                maxLength={100}
                placeholder="Enter a message for the notice"
                description="Use a maximum of 100 characters."
                required
                aria-required
            />

            {formState.error && !Array.isArray(formState.error) && (
                <ApplicationRequestFormError error={formState.error as ProblemDetails} />
            )}

            {formState.error && Array.isArray(formState.error) && <InputValidationError errors={formState.error} />}

            <FormButton width="full" pending={pending}>
                Create Notice
            </FormButton>
        </form>
    )
}
