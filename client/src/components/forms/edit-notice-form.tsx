"use client"

import { ProblemDetails } from "@/@types/application"
import { Notice } from "@/@types/notices"
import patchUpdateNotice from "@/actions/notices/patch-update-notice"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import FormButton from "@/components/shared/form-button"
import FormInput from "@/components/shared/form-input"
import { getInitialFormState } from "@/utils/functions"
import { useRouter } from "next/navigation"
import { type Dispatch, type SetStateAction, useActionState, useEffect } from "react"

interface EditNoticeFormProps {
    notice: Notice
    setOpen?: Dispatch<SetStateAction<boolean>>
}

export default function EditNoticeForm({ notice, setOpen }: Readonly<EditNoticeFormProps>) {
    const [formState, formAction, pending] = useActionState(patchUpdateNotice, getInitialFormState())
    const router = useRouter()

    useEffect(() => {
        if (formState.ok) {
            if (setOpen) setOpen(false)
            router.refresh()
        }
    }, [formState.ok, router, setOpen])

    return (
        <form action={formAction} className="mt-6 space-y-6">
            <input type="hidden" name="id" id="id" value={notice.id} />

            <FormInput
                label="Title"
                name="title"
                minLength={10}
                maxLength={100}
                defaultValue={notice.title}
                placeholder="Enter a title for the notice"
                description="Use at least 10 characters and a maximum of 100 characters."
            />

            <FormInput
                label="Message"
                name="message"
                maxLength={100}
                defaultValue={notice.message}
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
                Update Notice
            </FormButton>
        </form>
    )
}
