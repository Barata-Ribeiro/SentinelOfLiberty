"use client"

import { Comment } from "@/@types/comments"
import deleteComment from "@/actions/comments/delete-comment"
import RegularButton from "@/components/shared/regular-button"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { Session } from "next-auth"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import { FaTrashCan } from "react-icons/fa6"

interface CommentDeleteButtonProps {
    session: Session
    comment: Comment
}

export default function CommentDeleteButton({ session, comment }: Readonly<CommentDeleteButtonProps>) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleCommentDeletion() {
        startTransition(async () => {
            const deleteState = await deleteComment({ articleId: comment.articleId, commentId: comment.id })
            if (!deleteState.ok) {
                setOpen(false)
                router.refresh()
            }

            startTransition(() => {
                setOpen(false)
                router.replace(`/articles/${comment.articleId}/${comment.articleSlug}`)
            })
        })
    }

    return (
        <>
            <Button
                type="button"
                disabled={session.user.id !== comment.user.id && session.user.username !== comment.user.username}
                onClick={() => setOpen(true)}
                aria-label="Delete this comment"
                title="Delete this comment"
                className="inline-flex cursor-pointer items-center gap-x-1 rounded px-2 py-1 text-sm text-red-600 hover:text-red-700 active:text-red-800 disabled:pointer-events-none disabled:opacity-50">
                <FaTrashCan aria-hidden="true" className="size-4 text-inherit" /> Delete
            </Button>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed top-0 z-10 w-screen overflow-y-auto sm:inset-0">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <FaExclamationTriangle aria-hidden="true" className="size-5 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-shadow-900 text-base font-semibold">
                                            Delete comment
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-shadow-500 text-sm">
                                                Are you sure you want to delete this comment? This action cannot be
                                                undone. And you will lose all the replies to this comment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 bg-stone-50 px-4 py-3 sm:flex-row-reverse sm:px-6">
                                <RegularButton
                                    type="button"
                                    pending={isPending}
                                    buttonStyle="danger"
                                    aria-label="Yes, delete"
                                    title="Yes, delete"
                                    onClick={handleCommentDeletion}>
                                    Yes, delete
                                </RegularButton>

                                <RegularButton
                                    type="button"
                                    disabled={isPending}
                                    buttonStyle="ghost"
                                    data-autofocus
                                    aria-label="Cancel delete"
                                    title="Cancel delete"
                                    onClick={() => setOpen(false)}>
                                    Cancel
                                </RegularButton>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
