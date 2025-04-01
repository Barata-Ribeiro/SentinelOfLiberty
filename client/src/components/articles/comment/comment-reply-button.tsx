"use client"

import { Comment }                                                  from "@/@types/comments"
import NewCommentForm                                               from "@/components/forms/new-comment-form"
import { formatCommentDate, formatDisplayDate }                     from "@/utils/functions"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { Session }                                                  from "next-auth"
import { useState }                                                 from "react"
import { FaPenToSquare }                                            from "react-icons/fa6"

interface CommentReplyModalProps {
    session: Session
    comment: Comment
}

export default function CommentReplyButton({ session, comment }: Readonly<CommentReplyModalProps>) {
    const [ open, setOpen ] = useState(false)
    
    return (
        <>
            <Button
                type="button"
                disabled={ session.user.id === comment.user.id && session.user.username === comment.user.username }
                onClick={ () => setOpen(true) }
                aria-label="Reply to this comment"
                title="Reply to this comment"
                className="text-shadow-600 hover:text-shadow-700 active:text-shadow-800 inline-flex cursor-pointer items-center gap-x-1 rounded px-2 py-1 text-sm disabled:pointer-events-none disabled:opacity-50">
                <FaPenToSquare aria-hidden="true" className="size-4 text-inherit" /> Reply
            </Button>

            <Dialog open={ open } onClose={ setOpen } className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <header className="text-shadow-50 relative flex h-24 items-center justify-center rounded-md bg-stone-800">
                                <DialogTitle as="h3" className="text-2xl text-balance max-sm:px-1">
                                    Reply to { comment.user.username }
                                </DialogTitle>
                            </header>

                            <div className="my-4 border-b border-stone-200 pb-2">
                                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                                    <p className="text-shadow-600 order-2 sm:order-1">
                                        <span className="font-semibold">{ comment.user.username }</span> wrote
                                    </p>

                                    <div className="order-1 flex flex-col gap-2 divide-stone-200 max-sm:divide-y sm:order-2 sm:flex-row sm:divide-x">
                                        <time
                                            dateTime={ comment.createdAt.toISOString() }
                                            aria-label={ `Commented on ${ formatDisplayDate(String(comment.createdAt),
                                                                                            "date") }` }
                                            title={ `Commented on ${ formatDisplayDate(String(comment.createdAt),
                                                                                       "date") }` }
                                            className="text-shadow-500 block pr-0 pb-2 text-xs sm:pr-2 sm:pb-0">
                                            { formatDisplayDate(String(comment.createdAt), "date") }
                                        </time>

                                        <p className="text-shadow-300 block text-xs">
                                            { formatCommentDate(new Date(comment.createdAt).toISOString()) }
                                        </p>
                                    </div>
                                </div>
                                <p className="text-shadow-900 prose prose-sm mt-2">{ comment.content }</p>
                            </div>

                            <NewCommentForm parentId={ comment.id } displayAvatar={ false } setOpened={ setOpen } />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
