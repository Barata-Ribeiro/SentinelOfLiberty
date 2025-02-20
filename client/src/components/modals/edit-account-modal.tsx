"use client"

import EditProfileForm                                      from "@/components/forms/edit-profile-form"
import RegularButton                                        from "@/components/shared/regular-button"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import {
    DialogHeader,
}                                                           from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { useState }                                         from "react"

export default function EditAccountModal() {
    const [ open, setOpen ] = useState(false)
    
    return (
        <>
            <RegularButton
                buttonStyle="colored"
                onClick={ () => setOpen(true) }
                aria-label="Edit profile"
                title="Edit profile">
                Edit Profile
            </RegularButton>

            <Dialog open={ open } onClose={ setOpen } className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in"
                />

                <div className="fixed top-0 z-10 sm:inset-0">
                    <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative max-h-[90dvh] transform overflow-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <DialogHeader className="text-shadow-50 relative flex h-24 items-center justify-center rounded-md bg-stone-800">
                                <DialogTitle as="h3" className="text-2xl">
                                    Edit Profile
                                </DialogTitle>
                            </DialogHeader>

                            <EditProfileForm />
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
