"use client"

import FormButton                                                        from "@/components/shared/form-button"
import FormInput                                                         from "@/components/shared/form-input"
import FormTextarea                                                      from "@/components/shared/form-textarea"
import { Button, Dialog, DialogBackdrop, DialogPanel, Fieldset, Legend } from "@headlessui/react"
import {
    DialogHeader,
}                                                                        from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { useState }                                                      from "react"

export default function EditAccountModal() {
    const [ open, setOpen ] = useState(false)
    
    return (
        <>
            <Button
                type="button"
                onClick={ () => setOpen(true) }
                className="bg-marigold-600 hover:bg-marigold-700 active:bg-marigold-800 focus:ring-marigold-200 text-marigold-50 inline-flex w-max cursor-pointer items-center rounded-lg px-4 py-2 text-center text-sm font-medium select-none focus:ring-4 focus:outline-none"
                aria-label="Edit profile">
                Edit Profile
            </Button>

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
                                <h3 className="text-2xl">Edit Profile</h3>
                            </DialogHeader>

                            <form action="#" className="mt-6 space-y-6">
                                <Fieldset className="w-full space-y-4">
                                    <Legend className="font-heading text-shadow-800 text-lg font-bold">
                                        Account Information
                                    </Legend>
                                    <FormInput label="Username" type="text" name="username" />
                                    <FormInput label="Email" type="email" name="email" />
                                    <FormInput label="Display Name" type="text" name="displayName" />
                                </Fieldset>

                                <Fieldset className="w-full space-y-4">
                                    <Legend className="font-heading text-shadow-800 text-lg font-bold">
                                        Personal Information
                                    </Legend>
                                    <FormInput label="Location" type="text" name="location" />
                                    <FormInput label="Website" type="url" name="website" pattern="https://.*" />
                                    <FormTextarea label="Biography" id="biography" />
                                </Fieldset>

                                <Fieldset className="w-full space-y-4">
                                    <Legend className="font-heading text-shadow-800 text-lg font-bold">Security</Legend>
                                    <FormInput
                                        label="New Password"
                                        type="password"
                                        name="newPassword"
                                        description="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                                        autoComplete="new-password"
                                        aria-autocomplete="list"
                                    />
                                    <FormInput label="Confirm New Password" type="password" name="confirmNewPassword" />
                                </Fieldset>

                                <FormInput
                                    label="Current Password"
                                    type="password"
                                    name="currentPassword"
                                    autoComplete="current-password"
                                    aria-autocomplete="list"
                                    required
                                />

                                <FormButton className="w-full justify-center">Save Changes</FormButton>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
