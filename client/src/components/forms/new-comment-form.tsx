"use client"

import { ProblemDetails }                         from "@/@types/application"
import postNewComment                             from "@/actions/comments/post-new-comment"
import ApplicationRequestFormError                from "@/components/feedback/application-request-form-error"
import InputValidationError                       from "@/components/feedback/input-validation-error"
import Avatar                                     from "@/components/shared/avatar"
import FormButton                                 from "@/components/shared/form-button"
import FormTextarea                               from "@/components/shared/form-textarea"
import { formatCommentDate, getInitialFormState } from "@/utils/functions"
import { useSession }                             from "next-auth/react"
import { useParams, useRouter }                   from "next/navigation"
import { useActionState, useEffect, useState }    from "react"
import { FaLock }                                 from "react-icons/fa6"

function UnauthenticatedState() {
    return (
        <div className="block w-full max-w-3xl rounded-md bg-stone-100 p-12 text-center select-none">
            <FaLock aria-hidden="true" className="mx-auto block size-10 text-stone-400" />
            <p className="text-shadow-900 mt-2 block text-sm font-semibold">Sign in to leave a comment</p>
        </div>
    )
}

function OptimisticNewComment(props: { newComment: string }) {
    return (
        <div className="rounded-md border border-stone-200 p-4">
            <div className="inline-flex gap-x-2 divide-x divide-stone-200">
                <time dateTime={ new Date().toISOString() } className="text-shadow-500 block pr-2 text-xs">
                    { new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }) }
                </time>

                <p className="text-shadow-300 block text-xs">{ formatCommentDate(new Date().toISOString()) }</p>
            </div>

            <p className="text-shadow-900 prose mt-2">{ props.newComment }</p>
        </div>
    )
}

export default function NewCommentForm({ parentId }: Readonly<{ parentId?: number }>) {
    const [ formState, formAction, pending ] = useActionState(postNewComment, getInitialFormState())
    const [ newComment, setNewComment ] = useState("")
    const params = useParams<{ id: string; slug: string }>()
    const router = useRouter()
    
    useEffect(() => {
        if (formState.ok) router.refresh()
    }, [ formState.ok, router ])
    
    const { data: session, status } = useSession()
    if (!session || status !== "authenticated") return <UnauthenticatedState />
    
    return (
        <div className="flex max-w-3xl items-start space-x-4">
            <Avatar name={ session?.user.username } size={ 48 } src={ session.user.avatarUrl } animate={ false } />

            <div className="min-w-0 flex-1">
                { pending && newComment ? (
                    <OptimisticNewComment newComment={ newComment } />
                ) : (
                      <form action={ formAction } className="space-y-4">
                        <FormTextarea
                            label="Leave a comment"
                            name="body"
                            rows={ 5 }
                            minLength={ 5 }
                            maxLength={ 400 }
                            placeholder="Enter your comment here..."
                            description="Use at least 5 characters and a maximum of 400 characters."
                            required
                            aria-required
                            onChange={ event => setNewComment(event.target.value) }
                        />
                        <input type="hidden" name="articleId" value={ params.id } />
                        <input type="hidden" name="parentId" value={ parentId } />
                          
                          { formState.error && !Array.isArray(formState.error) && (
                              <ApplicationRequestFormError error={ formState.error as ProblemDetails } />
                          ) }
                          
                          { formState.error && Array.isArray(formState.error) && (
                              <InputValidationError errors={ formState.error } />
                          ) }
                          
                          <FormButton className="w-full" disabled={ pending || !session }>
                            Post Comment
                        </FormButton>
                    </form>
                  ) }
            </div>
        </div>
    )
}
