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
import { Fieldset }                 from "@headlessui/react"
import { useActionState, useState } from "react"
import placeholderImage             from "../../../public/image-error-placeholder.svg"

export default function NewSuggestionForm() {
    const [ formState, formAction, pending ] = useActionState(postNewSuggestion, getInitialFormState())
    const [ imgUrl, setImgUrl ] = useState("")
    
    return (
        <form action={ formAction } className="mx-auto mb-8 w-full max-w-2xl space-y-6">
            <FormInput
                type="text"
                label="Title"
                name="title"
                placeholder="e.g., Breaking News: Major Event Unfolds"
                required
                aria-required
            />

            <FormInput
                type="url"
                label="Source"
                name="sourceUrl"
                pattern="https://.*"
                placeholder="https://example.com/article"
                required
                aria-required
            />

            <FormTextarea
                label="Content"
                name="content"
                rows={ 8 }
                minLength={ 10 }
                maxLength={ 500 }
                placeholder="Describe your suggestions here..."
                description="Use at least 10 characters and a maximum of 500 characters."
                required
                aria-required
            />

            <Fieldset className="mx-auto w-full max-w-2xl space-y-3">
                <FormInput
                    type="url"
                    label="Image"
                    name="mediaUrl"
                    pattern="https://.*"
                    placeholder="https://example.com/image.jpg"
                    description="Add the URL of the image you want to use as a cover for your article."
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
                      "Submit Suggestion"
                  ) }
            </FormButton>
        </form>
    )
}
