"use client"

import { ProblemDetails }            from "@/@types/application"
import postNewNotice                 from "@/actions/notices/post-new-notice"
import ApplicationRequestFormError   from "@/components/feedback/application-request-form-error"
import InputValidationError          from "@/components/feedback/input-validation-error"
import Spinner                       from "@/components/helpers/spinner"
import FormButton                    from "@/components/shared/form-button"
import FormInput                     from "@/components/shared/form-input"
import { getInitialFormState }       from "@/utils/functions"
import { useRouter }                 from "next/navigation"
import { useActionState, useEffect } from "react"

export default function NewNoticeForm() {
    const [ formState, formAction, pending ] = useActionState(postNewNotice, getInitialFormState())
    const router = useRouter()
    
    useEffect(() => {
        if (formState.ok) router.refresh()
    }, [ formState.ok, router ])
    
    return (
        <form action={ formAction } className="space-y-6 mt-6">
            <FormInput label="Title" name="title" minLength={ 10 } maxLength={ 100 } />
            <FormInput label="Message" name="message" maxLength={ 100 } required />
            
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
                      "Create Notice"
                  ) }
            </FormButton>
        </form>
    )
}
