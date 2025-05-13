"use client"

import { Notice } from "@/@types/notices"
import EditNoticeForm from "@/components/forms/edit-notice-form"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useState } from "react"

interface EditNoticeModalProps {
    notice: Notice
}

export default function EditNoticeModal({ notice }: Readonly<EditNoticeModalProps>) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                type="button"
                onClick={() => setOpen(true)}
                title={`Edit, ${notice.title ?? "Current Notice"}`}
                className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 inline-flex cursor-pointer transition-all duration-300 ease-in disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Edit <span className="sr-only">, {notice.title ?? "Current Notice"}</span>
            </Button>

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <header className="text-shadow-50 relative flex h-24 items-center justify-center rounded-md bg-stone-800">
                                <DialogTitle as="h3" className="text-2xl text-balance max-sm:px-4">
                                    Editing Notice {notice.id}, &lsquo;{notice.title ?? "Current Notice"}&rsquo;
                                </DialogTitle>
                            </header>

                            <EditNoticeForm notice={notice} setOpen={setOpen} />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
