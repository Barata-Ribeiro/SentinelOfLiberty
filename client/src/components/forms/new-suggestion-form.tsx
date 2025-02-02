"use client"

import { ProblemDetails }           from "@/@types/application"
import postNewSuggestion            from "@/actions/suggestions/post-new-suggestion"
import ApplicationRequestFormError  from "@/components/feedback/application-request-form-error"
import InputValidationError         from "@/components/feedback/input-validation-error"
import Spinner                      from "@/components/helpers/spinner"
import FormButton                   from "@/components/shared/form-button"
import FormInput                    from "@/components/shared/form-input"
import FormTextarea                 from "@/components/shared/form-textarea"
import { getInitialFormState }      from "@/utils/functions"
import { Field }                    from "@headlessui/react"
import { useActionState, useState } from "react"
import placeholderImage             from "../../../public/image-error-placeholder.svg"

export default function NewSuggestionForm() {
    const [ formState, formAction, pending ] = useActionState(postNewSuggestion, getInitialFormState())
    const [ imgUrl, setImgUrl ] = useState("")
    
    return (
        <form action={ formAction } className="mx-auto mb-8 w-full max-w-2xl space-y-6">
            <FormInput label="Title" name="title" type="text" />

            <FormInput label="Source" name="sourceUrl" type="url" />

            <FormTextarea label="Content" name="content" minLength={ 10 } maxLength={ 500 } />

            <Field className="mx-auto w-full max-w-2xl space-y-3">
                <FormInput
                    label="Image"
                    name="mediaUrl"
                    type="url"
                    pattern="https://.*"
                    required
                    aria-required
                    onChange={ event => setImgUrl(event.target.value) }
                />
                
                { imgUrl && (
                    <div className="min-w-none mx-auto rounded-md shadow">
                        {/* eslint-disable-next-line @next/next/no-img-element */ }
                        <img
                            src={ imgUrl }
                            alt="Preview"
                            title="Preview"
                            className="min-h-96 w-full rounded-md object-cover object-center"
                            sizes="100vw"
                            onError={ event => {
                                event.currentTarget.id = placeholderImage.id
                                event.currentTarget.src = placeholderImage.src
                            } }
                        />
                    </div>
                ) }
            </Field>
            
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
                      "Submit Suggestion"
                  ) }
            </FormButton>
        </form>
    )
}
