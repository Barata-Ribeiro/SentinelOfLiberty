"use client"

import deleteCurrentNotice from "@/actions/notices/delete-current-notice"
import RegularButton from "@/components/shared/regular-button"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { FaExclamationTriangle } from "react-icons/fa"

interface DeleteNoticeModalProps {
    id: number
    title: string
}

export default function DeleteNoticeModal({ id, title }: Readonly<DeleteNoticeModalProps>) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleDelete() {
        startTransition(async () => {
            const deleteState = await deleteCurrentNotice({ id })

            if (!deleteState.ok) {
                setOpen(false)
                router.refresh()
            }

            startTransition(() => {
                setOpen(false)
                router.refresh()
            })
        })
    }

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                title={`Delete, ${title ?? "Current Notice"}`}
                className="inline-flex cursor-pointer text-red-600 transition-all duration-300 ease-in hover:text-red-700 active:text-red-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Delete <span className="sr-only">, {title ?? "Current Notice"}</span>
            </Button>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                                            Delete Notice {id} - {title ?? "Current Notice"}
                                        </DialogTitle>

                                        <p className="text-shadow-500 mt-2 text-sm">
                                            Are you sure you want to delete this notice? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="gap-2 bg-stone-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <RegularButton
                                    type="button"
                                    pending={isPending}
                                    buttonStyle="danger"
                                    aria-label="Yes, delete"
                                    title="Yes, delete"
                                    onClick={handleDelete}>
                                    Yes, delete
                                </RegularButton>

                                <RegularButton
                                    type="button"
                                    disabled={isPending}
                                    buttonStyle="ghost"
                                    data-autofocus
                                    aria-label="Cancel delete notice"
                                    title="Cancel delete notice"
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
