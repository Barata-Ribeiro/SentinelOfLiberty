"use client"

import { ProblemDetails } from "@/@types/application"
import deleteUser from "@/actions/admin/delete-user"
import ApplicationRequestFormError from "@/components/feedback/application-request-form-error"
import RegularButton from "@/components/shared/regular-button"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { FaExclamationTriangle } from "react-icons/fa"
import { LuTrash2 } from "react-icons/lu"

interface AdminDeleteButtonProps {
    username: string
}

export default function AdminDeleteButton({ username }: Readonly<AdminDeleteButtonProps>) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<ProblemDetails | null>(null)
    const router = useRouter()

    function handleUserDelete() {
        startTransition(async () => {
            const deleteState = await deleteUser({ username })
            if (!deleteState.ok) {
                setError(deleteState.error as ProblemDetails)
                return
            }

            startTransition(() => {
                setOpen(false)
                setError(null)
                router.refresh()
            })
        })
    }

    return (
        <>
            <Button
                className="group flex w-full cursor-pointer items-center px-4 py-2 text-sm text-red-600 active:text-red-800 data-focus:bg-stone-100 data-focus:text-red-800 data-focus:outline-hidden data-hover:bg-stone-100 data-hover:text-red-700"
                aria-label="Delete user"
                title="Delete user"
                onClick={() => setOpen(true)}
                disabled={isPending}>
                <LuTrash2 aria-hidden="true" className="mr-3 size-4 text-inherit" />
                Delete User
            </Button>

            <Dialog open={open} onClose={setOpen} className="relative z-50">
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
                                            Delete User
                                        </DialogTitle>

                                        <p className="text-shadow-500 mt-2 text-sm">
                                            Are you sure you want to delete the account of{" "}
                                            <strong>&ldquo;{username}&rdquo;</strong> ?
                                        </p>

                                        {error && (
                                            <div className="mt-2 text-left">
                                                <ApplicationRequestFormError error={error} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row-reverse gap-2 bg-stone-50 px-4 py-3 sm:px-6">
                                <RegularButton
                                    type="button"
                                    pending={isPending}
                                    buttonStyle="danger"
                                    aria-label="Delete user"
                                    title="Delete user"
                                    onClick={handleUserDelete}>
                                    Delete
                                </RegularButton>

                                <RegularButton
                                    type="button"
                                    disabled={isPending}
                                    buttonStyle="ghost"
                                    data-autofocus
                                    aria-label="Cancel"
                                    title="Cancel"
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
