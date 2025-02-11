"use client"

import { ProblemDetails }          from "@/@types/application"
import postAuthLogin               from "@/actions/auth/post-auth-login"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import InputValidationError        from "@/components/feedback/input-validation-error"
import Spinner                     from "@/components/helpers/spinner"
import Avatar                      from "@/components/shared/avatar"
import FormButton                  from "@/components/shared/form-button"
import FormTextarea                from "@/components/shared/form-textarea"
import { getInitialFormState }     from "@/utils/functions"
import { useSession }              from "next-auth/react"
import { useParams }               from "next/navigation"
import { useActionState }          from "react"
import { FaLock }                  from "react-icons/fa6"

function UnauthenticatedState() {
    return (
        <div className="block w-full max-w-3xl rounded-md bg-stone-100 p-12 text-center select-none">
            <FaLock aria-hidden="true" className="mx-auto block size-10 text-stone-400" />
            <p className="text-shadow-900 mt-2 block text-sm font-semibold">Sign in to leave a comment</p>
        </div>
    )
}

export default function NewCommentForm({ parentId }: Readonly<{ parentId?: number }>) {
    const [ formState, formAction, pending ] = useActionState(postAuthLogin, getInitialFormState())
    const params = useParams<{ id: string; slug: string }>()
    
    const { data: session, status } = useSession()
    if (!session || status !== "authenticated") return <UnauthenticatedState />
    
    return (
        <div className="flex max-w-3xl items-start space-x-4">
            <Avatar name={ session?.user.username } size={ 48 } src={ session.user.avatarUrl } animate={ false } />

            <div className="min-w-0 flex-1">
                <form action={ formAction } className="space-y-4">
                    <FormTextarea label="Leave a comment" name="body" />
                    <input type="hidden" name="articleId" value={ params.id } />
                    <input type="hidden" name="parentId" value={ parentId } />
                    
                    { formState.error && !Array.isArray(formState.error) && (
                        <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
                    ) }
                    
                    { formState.error && Array.isArray(formState.error) && (
                        <InputValidationError errors={ formState.error } />
                    ) }
                    
                    <FormButton className="w-full" disabled={ pending || !session }>
                        { pending ? (
                            <>
                                <Spinner /> Loading...
                            </>
                        ) : (
                              "Post Comment"
                          ) }
                    </FormButton>
                </form>
            </div>
        </div>
    )
}
